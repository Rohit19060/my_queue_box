import { writable } from "svelte/store";
import { openDatabase } from "./Common";

export const READ_STORE = writable<App.ReadIndexDB[]>([]);
export const IS_ADD_MODAL = writable(false);

export const DB_READ_STORE = 'readStore';

export async function storeReadInIndexedDB(data: App.ReadIndexDB): Promise<void> {
    const DB = await openDatabase();
    const TRANSACTION = DB.transaction(DB_READ_STORE, 'readwrite');
    const OBJECT_STORE = TRANSACTION.objectStore(DB_READ_STORE);
    return new Promise((resolve, reject) => {
        OBJECT_STORE.put(data);
        TRANSACTION.oncomplete = () => resolve();
        TRANSACTION.onerror = (event: Event) => reject((event.target as IDBRequest).error);
    });
}

export async function fetchReadData(): Promise<{ results: App.ReadIndexDB[]; }> {
    const DB = await openDatabase();
    const TRANSACTION = DB.transaction(DB_READ_STORE, 'readonly');
    const OBJECT_STORE = TRANSACTION.objectStore(DB_READ_STORE);
    return new Promise((resolve, reject) => {
        const REQUEST = OBJECT_STORE.getAll();
        REQUEST.onsuccess = (event: Event) => {
            const RESULTS = (event.target as IDBRequest).result;
            resolve({ results: RESULTS });
        };
        REQUEST.onerror = (event: Event) => reject((event.target as IDBRequest).error);
    });
}

export async function totalReadCount(): Promise<{ total: number }> {
    const DB = await openDatabase();
    const TRANSACTION = DB.transaction(DB_READ_STORE, 'readonly');
    const OBJECT_STORE = TRANSACTION.objectStore(DB_READ_STORE);
    return new Promise((resolve, reject) => {
        const totalRequest = OBJECT_STORE.count();
        totalRequest.onsuccess = () => {
            resolve({ total: totalRequest.result });
        };
        totalRequest.onerror = (event: Event) => reject((event.target as IDBRequest).error);
    });
}

export async function topReads(): Promise<App.ReadIndexDB[]> {
    const DB = await openDatabase();
    const TRANSACTION = DB.transaction(DB_READ_STORE, 'readonly');
    const OBJECT_STORE = TRANSACTION.objectStore(DB_READ_STORE);
    const RESULTS: App.ReadIndexDB[] = [];
    return new Promise((resolve, reject) => {
        const OPEN_REQUEST = OBJECT_STORE.openCursor(null, 'prev');
        OPEN_REQUEST.onsuccess = (event: Event) => {
            const CURSOR = (event.target as IDBRequest<IDBCursorWithValue>).result;
            if (CURSOR && RESULTS.length < 5) {
                RESULTS.push(CURSOR.value);
                CURSOR.continue();
            } else {
                resolve(RESULTS);
            }
        };
        OPEN_REQUEST.onerror = (event: Event) => reject((event.target as IDBRequest).error);
    });
}

export async function removeReadFromIndexDB(id: number) {
    const DB = await openDatabase();
    const TRANSACTION = DB.transaction(DB_READ_STORE, 'readwrite');
    const OBJECT_STORE = TRANSACTION.objectStore(DB_READ_STORE);
    return new Promise((resolve, reject) => {
        const REQUEST = OBJECT_STORE.delete(id);
        REQUEST.onsuccess = () => resolve({ id: id, success: true });
        REQUEST.onerror = (event: Event) => reject((event.target as IDBRequest).error);
    });
}