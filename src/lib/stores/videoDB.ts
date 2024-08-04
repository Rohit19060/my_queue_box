import { writable } from 'svelte/store';
import { totalCount } from './spaStore';

const ITEMS_PER_PAGE = 50;
export const DB_VERSION = 1;
export const DB_NAME = 'MyWatchDatabase';
export const dataStore = writable<VideoIndexDB[]>([]);
export const isLoading = writable(false);
export const hasMore = writable(true);
export const currentCursorValue = writable<IDBValidKey | null>(null);

export const page = writable(0);

export function dbUpgrade(event: IDBVersionChangeEvent) {
    const db = (event.target as IDBOpenDBRequest).result;
    if (!db.objectStoreNames.contains('videoStore')) {
        const objectStore = db.createObjectStore('videoStore', { keyPath: 'id' }) as IDBObjectStore;
        objectStore.createIndex('titleIndex', 'title', { unique: false }); // Create an index for sorting by title
        objectStore.createIndex('durationIndex', 'durationSec', { unique: false });
        objectStore.createIndex('channelIndex', 'channelTitle', { unique: false });
        objectStore.createIndex('publishedAtIndex', 'publishedAt', { unique: false });
    }
};


export async function fetchPaginatedData(cursorValue: IDBValidKey | null, sortBy: string = 'durationIndex', isDesc: boolean = false): Promise<{ data: VideoIndexDB[], nextCursorValue: IDBValidKey | null }> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = dbUpgrade;
        request.onsuccess = (event: Event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            const transaction = db.transaction('videoStore', 'readonly');
            const objectStore = transaction.objectStore('videoStore');
            const index = objectStore.index(sortBy);

            const direction = isDesc ? 'prev' : 'next';

            const results: VideoIndexDB[] = [];
            let counter = 0;
            let nextCursorValue: IDBValidKey | null = null;
            const openRequest = cursorValue !== null ? index.openCursor(IDBKeyRange.lowerBound(cursorValue, true), direction) : index.openCursor(null, direction);
            const countRequest = index.count();
            countRequest.onsuccess = () => totalCount.set(countRequest.result);
            openRequest.onsuccess = (event: Event) => {
                const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
                if (cursor && counter < ITEMS_PER_PAGE) {
                    results.push(cursor.value);
                    counter++;
                    nextCursorValue = cursor.key;
                    cursor.continue();
                } else {
                    resolve({ data: results, nextCursorValue });
                }
            };

            openRequest.onerror = (event: Event) => {
                reject((event.target as IDBRequest).error);
            };
        };

        request.onerror = (event: Event) => {
            reject((event.target as IDBRequest).error);
        };
    });
}
