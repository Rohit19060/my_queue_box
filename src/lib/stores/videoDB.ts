import { convertToVideoIndexDB } from '$lib';
import { writable } from 'svelte/store';

const ITEMS_PER_PAGE = 40;
const DB_VERSION = 1;
const DB_NAME = 'kings-library';
const DB_VIDEO_STORE = 'videoStore';

export enum SortOptions {
    Title = 'titleIndex',
    Duration = 'durationIndex',
    Channel = 'channelIndex',
    PublishedAt = 'publishedAtIndex'
}

export const SortOptionDetails: { [key in SortOptions]: { keypath: string[] | string, str: string } } = {
    [SortOptions.Title]: { keypath: 'title', str: 'Title' },
    [SortOptions.Duration]: { keypath: ['durationSec', 'id'], str: 'Duration' },
    [SortOptions.Channel]: { keypath: ['channelTitle', 'id'], str: 'Channel' },
    [SortOptions.PublishedAt]: { keypath: ['publishedAtStr', 'id'], str: 'Published' }
};

// export const SORT_OPTIONS = ['titleIndex', 'durationIndex', 'channelIndex', 'publishedAtIndex'];
export const sortBy = writable<SortOptions>(SortOptions.PublishedAt);
export const isDesc = writable<boolean>(true);
export const dataStore = writable<VideoIndexDB[]>([]);
export const searchDataStore = writable<VideoIndexDB[]>([]);
export const hasMore = writable(true);
export const currentCursorValue = writable<IDBValidKey | null>(null);

export const videoDetails = writable<YouTubeVideo | null>(null);
export const error = writable<string | null>(null);

export const page = writable(typeof window !== 'undefined' ? parseInt(localStorage.getItem('spaPage') || '0') : 0);

let dbInstance: IDBDatabase | null = null;
let upgradeInProgress = false;

function openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        if (dbInstance) {
            resolve(dbInstance);
            return;
        }
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = async (event: IDBVersionChangeEvent) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!upgradeInProgress) {
                upgradeInProgress = true;
                if (!db.objectStoreNames.contains(DB_VIDEO_STORE)) {
                    const objectStore = db.createObjectStore(DB_VIDEO_STORE, { keyPath: 'id' }) as IDBObjectStore;
                    Object.values(SortOptions).forEach((sortOption) => {
                        objectStore.createIndex(sortOption, SortOptionDetails[sortOption].keypath);
                    });
                }
                upgradeInProgress = false;
            }
        };

        request.onsuccess = (event: Event) => {
            dbInstance = (event.target as IDBOpenDBRequest).result;
            resolve(dbInstance);
        };

        request.onerror = (event: Event) => {
            reject((event.target as IDBOpenDBRequest).error);
        };
    });
}


// Optional: Data migration example (if structure changes)
// const request = objectStore.openCursor();
// request.onsuccess = (event: Event) => {
//     const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
//     if (cursor) {
//         // const video = cursor.value as VideoIndexDB;

//         // Perform any migration logic here (e.g., adding new fields, modifying existing ones)
//         // Example: Adding a new field 'newField' to each record
//         // if (!video.newField) {
//         //     video.newField = 'defaultValue';
//         //     cursor.update(video);  // Save the modified record back
//         // }

//         cursor.continue();
//     }
// };
//     }


export async function storeDataInIndexedDB(data: VideoJsonResponse[]): Promise<void> {
    const db = await openDatabase();
    const transaction = db.transaction(DB_VIDEO_STORE, 'readwrite');
    const objectStore = transaction.objectStore(DB_VIDEO_STORE);
    return new Promise((resolve, reject) => {
        data.forEach((item) => {
            const convertedItem = convertToVideoIndexDB(item);
            objectStore.put(convertedItem);
        });
        transaction.oncomplete = () => {
            resolve();
        };
        transaction.onerror = (event: Event) => reject((event.target as IDBRequest).error);
    });
}


export async function fetchPaginatedData(cursorValue: IDBValidKey | null, sortBy: SortOptions = SortOptions.PublishedAt, isDesc: boolean = true): Promise<{ results: VideoIndexDB[], nextCursorValue: IDBValidKey | null }> {
    const db = await openDatabase();
    const transaction = db.transaction(DB_VIDEO_STORE, 'readonly');
    const objectStore = transaction.objectStore(DB_VIDEO_STORE);
    const index = objectStore.index(sortBy);

    const direction = isDesc ? 'prev' : 'next';
    const results: VideoIndexDB[] = [];
    let counter = 0;
    let nextCursorValue: IDBValidKey | null = null;

    return new Promise((resolve, reject) => {
        const openRequest = cursorValue != null
            ? index.openCursor(direction == 'prev' ? IDBKeyRange.upperBound(cursorValue, true) : IDBKeyRange.lowerBound(cursorValue, true), direction)
            : index.openCursor(null, direction);

        openRequest.onsuccess = (event: Event) => {
            const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
            if (cursor && counter < ITEMS_PER_PAGE) {
                results.push(cursor.value);
                counter++;
                nextCursorValue = cursor.key;
                cursor.continue();
            } else {
                resolve({ results, nextCursorValue });
            }
        };

        openRequest.onerror = (event: Event) => {
            reject((event.target as IDBRequest).error);
        };
    });
}


export async function addVideoToIndexDB(video: YouTubeVideo) {
    const db = await openDatabase();
    const transaction = db.transaction(DB_VIDEO_STORE, 'readwrite');
    const objectStore = transaction.objectStore(DB_VIDEO_STORE);
    return new Promise((resolve, reject) => {
        const request = objectStore.put(convertToVideoIndexDB(video));
        request.onsuccess = () => resolve(video);
        request.onerror = (event: Event) => {
            reject((event.target as IDBRequest).error);
        };
    });
}

export async function removeVideoFromIndexDB(id: string) {
    const db = await openDatabase();
    const transaction = db.transaction(DB_VIDEO_STORE, 'readwrite');
    const objectStore = transaction.objectStore(DB_VIDEO_STORE);
    return new Promise((resolve, reject) => {
        const request = objectStore.delete(id);
        request.onsuccess = () => resolve({ "id": id, "success": true });
        request.onerror = (event: Event) => {
            reject((event.target as IDBRequest).error);
        };
    });
}


export async function searchVideos(cursorValue: IDBValidKey | null, sortBy: string = 'titleIndex', isDesc: boolean = true, searchText: string): Promise<{ results: VideoIndexDB[], nextCursorValue: IDBValidKey | null }> {
    const db = await openDatabase();
    const transaction = db.transaction(DB_VIDEO_STORE, 'readonly');
    const objectStore = transaction.objectStore(DB_VIDEO_STORE);
    const index = objectStore.index(sortBy);

    const direction = isDesc ? 'prev' : 'next';
    const results: VideoIndexDB[] = [];
    let counter = 0;
    let nextCursorValue: IDBValidKey | null = null;

    return new Promise((resolve, reject) => {
        const openRequest = cursorValue != null
            ? index.openCursor(direction == 'prev' ? IDBKeyRange.upperBound(cursorValue, true) : IDBKeyRange.lowerBound(cursorValue, true), direction)
            : index.openCursor(null, direction);

        const searchTextLower = searchText.toLowerCase();
        openRequest.onsuccess = (event: Event) => {
            const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
            if (cursor && counter < ITEMS_PER_PAGE) {
                const video = cursor.value as VideoIndexDB;
                if (video.title.toLowerCase().includes(searchTextLower) || video.channelTitle.toLowerCase().includes(searchTextLower)) {
                    results.push(video);
                    counter++;
                }
                nextCursorValue = cursor.key;
                cursor.continue();
            } else {
                resolve({ results, nextCursorValue });
            }
        };

        openRequest.onerror = (event: Event) => {
            reject((event.target as IDBRequest).error);
        };
    });
}

export async function getIndexReverseList() {
    const db = await openDatabase();
    const transaction = db.transaction(DB_VIDEO_STORE, 'readonly');
    const objectStore = transaction.objectStore(DB_VIDEO_STORE);

    return new Promise((resolve, reject) => {
        const openRequest = objectStore.getAll();
        openRequest.onsuccess = () => {
            resolve(openRequest.result);
        };

        openRequest.onerror = (event: Event) => {
            reject((event.target as IDBRequest).error);
        };
    });
}