import { DB_READ_STORE } from "./ReadDB";
import { DB_VIDEO_STORE, SortOptionDetails, SortOptions } from "./VideoDB";

let dbInstance: IDBDatabase | null = null;
let upgradeInProgress = false;
const DB_VERSION = 2;
const DB_NAME = 'kings-library';

export function openDatabase(): Promise<IDBDatabase> {
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
                    const objectStore = db.createObjectStore(DB_VIDEO_STORE, {
                        keyPath: 'id'
                    }) as IDBObjectStore;
                    Object.values(SortOptions).forEach((sortOption) => {
                        objectStore.createIndex(sortOption, SortOptionDetails[sortOption].keypath);
                    });
                }
                if (!db.objectStoreNames.contains(DB_READ_STORE)) {
                    db.createObjectStore(DB_READ_STORE, {
                        keyPath: 'id'
                    }) as IDBObjectStore;
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
