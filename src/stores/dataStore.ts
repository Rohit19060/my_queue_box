// src/stores/dataStore.ts
import { writable } from 'svelte/store';

const ITEMS_PER_PAGE = 100;

export const dataStore = writable<VideoIndexDB[]>([]);
export const isLoading = writable(false);
export const hasMore = writable(true);
export const currentPage = writable(0);

export async function fetchPaginatedData(page: number): Promise<VideoIndexDB[]> {
    return new Promise<VideoIndexDB[]>((resolve, reject) => {
        const request = indexedDB.open('MyWatchDatabase', 3);

        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains('videoStore')) {
                db.createObjectStore('videoStore', { keyPath: 'id' });
            }
        };

        request.onsuccess = (event: Event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            const transaction = db.transaction('videoStore', 'readonly');
            const objectStore = transaction.objectStore('videoStore');
            const index = objectStore.index('by_id'); // Assumes you have an index on 'id'
            const range = IDBKeyRange.bound(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1);
            const request = index.openCursor(range);
            const results: VideoIndexDB[] = [];
            
            request.onsuccess = (event: Event) => {
                const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
                if (cursor) {
                    results.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };

            request.onerror = (event: Event) => reject((event.target as IDBRequest).error);
        };

        request.onerror = (event: Event) => reject((event.target as IDBRequest).error);
    });
}
