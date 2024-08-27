import { convertToVideoIndexDB } from '$lib';
import { writable } from 'svelte/store';

const ITEMS_PER_PAGE = 40;
const DB_VERSION = 1;
const DB_NAME = 'kings-library';
const DB_VIDEO_STORE = 'videoStore';
export const dataStore = writable<VideoIndexDB[]>([]);
export const searchDataStore = writable<VideoIndexDB[]>([]);
export const hasMore = writable(true);
export const currentCursorValue = writable<IDBValidKey | null>(null);

export const videoDetails = writable<VideoIndexDB | null>(null);
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
                    objectStore.createIndex('titleIndex', 'title');
                    objectStore.createIndex('durationIndex', ['durationSec', 'id']);
                    objectStore.createIndex('channelIndex', ['channelTitle', 'id']);
                    objectStore.createIndex('publishedAtIndex', ['publishedAtStr', 'id']);
                }
                const objectStore = db.transaction(DB_VIDEO_STORE, 'readwrite').objectStore(DB_VIDEO_STORE);
                const request = objectStore.openCursor();
                console.log("DB created");
                request.onsuccess = (event: Event) => {
                    const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
                    if (cursor) {
                        const video = cursor.value as VideoIndexDB;

                        if (!video.durationSecStr) {
                            video.durationSecStr = video.durationSec.toString();
                        }
                        if (!video.publishedAtStr) {
                            video.publishedAtStr = video.publishedAt.toString();
                        }
                        cursor.update(video);  // Save the modified record back
                        cursor.continue();
                    }
                };

                //  check of indexes exists
                const indexNames = db.objectStoreNames;
                if (indexNames.contains('durationIndex')) {
                    const objectStore = db.createObjectStore(DB_VIDEO_STORE, { keyPath: 'id' }) as IDBObjectStore;
                    objectStore.deleteIndex('durationIndex');
                    objectStore.createIndex('durationIndex', ['durationSecStr', 'id'], { unique: true });
                }

                if (!indexNames.contains('publishedAtIndex')) {
                    const objectStore = db.createObjectStore(DB_VIDEO_STORE, { keyPath: 'id' }) as IDBObjectStore;
                    objectStore.deleteIndex('publishedAtIndex');
                    objectStore.createIndex('publishedAtIndex', ['publishedAtStr', 'id'], { unique: true });
                }
                // Finish upgrade
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


export async function fetchPaginatedData(cursorValue: IDBValidKey | null, sortBy: string = 'titleIndex', isDesc: boolean = false): Promise<{ data: VideoIndexDB[], nextCursorValue: IDBValidKey | null }> {
    const db = await openDatabase();
    const transaction = db.transaction(DB_VIDEO_STORE, 'readonly');
    const objectStore = transaction.objectStore(DB_VIDEO_STORE);
    const index = objectStore.index(sortBy);

    const direction = isDesc ? 'prev' : 'next';
    const results: VideoIndexDB[] = [];
    let counter = 0;
    let nextCursorValue: IDBValidKey | null = null;

    console.log("Sort by: ", sortBy);
    console.log("Cursor value: ", cursorValue);
    console.log("Sort order: ", direction);

    return new Promise((resolve, reject) => {
        const openRequest = cursorValue !== null
            ? index.openCursor(IDBKeyRange.lowerBound(cursorValue, true), direction)
            : index.openCursor(null, direction);

        openRequest.onsuccess = (event: Event) => {
            const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
            if (cursor) {
                if (counter < ITEMS_PER_PAGE) {
                    results.push(cursor.value);
                    counter++;
                    nextCursorValue = cursor.key;
                    cursor.continue();
                } else {
                    resolve({ data: results, nextCursorValue });
                }
            } else {
                resolve({ data: results, nextCursorValue: null });
            }
        };

        openRequest.onerror = (event: Event) => {
            reject((event.target as IDBRequest).error);
        };
    });
}


export async function addVideoToIndexDB(video: VideoIndexDB) {
    const db = await openDatabase();
    const transaction = db.transaction(DB_VIDEO_STORE, 'readwrite');
    const objectStore = transaction.objectStore(DB_VIDEO_STORE);
    return new Promise((resolve, reject) => {
        const request = objectStore.put(video);
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


export async function searchVideos(cursorValue: IDBValidKey | null, sortBy: string = 'titleIndex', isDesc: boolean = true, searchText: string): Promise<{ data: VideoIndexDB[], nextCursorValue: IDBValidKey | null }> {
    const db = await openDatabase();
    const transaction = db.transaction(DB_VIDEO_STORE, 'readonly');
    const objectStore = transaction.objectStore(DB_VIDEO_STORE);
    const index = objectStore.index(sortBy);

    const direction = isDesc ? 'prev' : 'next';
    const results: VideoIndexDB[] = [];
    let counter = 0;
    let nextCursorValue: IDBValidKey | null = null;

    return new Promise((resolve, reject) => {
        const openRequest = cursorValue !== null ? index.openCursor(IDBKeyRange.lowerBound(cursorValue, true), direction) : index.openCursor(null, direction);

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
                resolve({ data: results, nextCursorValue });
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