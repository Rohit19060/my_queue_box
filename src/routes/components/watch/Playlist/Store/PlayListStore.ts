import { openDatabase } from "$lib/stores/Common";
import { writable } from "svelte/store";

export const PLAYLIST_STORE = writable<App.PlaylistIndexDB[]>([]);
export const SIDEBAR_OPEN = writable(false);

export const DB_PLAYLIST_STORE = 'playlistStore';

export async function storePlaylistInIndexedDB(data: App.PlaylistIndexDB): Promise<void> {
    const DB = await openDatabase();
    const TRANSACTION = DB.transaction(DB_PLAYLIST_STORE, 'readwrite');
    const OBJECT_STORE = TRANSACTION.objectStore(DB_PLAYLIST_STORE);
    return new Promise((resolve, reject) => {
        OBJECT_STORE.put(data);
        TRANSACTION.oncomplete = () => resolve();
        TRANSACTION.onerror = (event: Event) => reject((event.target as IDBRequest).error);
    });
}

export async function fetchPlaylistData(): Promise<{ results: App.PlaylistIndexDB[]; }> {
    const DB = await openDatabase();
    const TRANSACTION = DB.transaction(DB_PLAYLIST_STORE, 'readonly');
    const OBJECT_STORE = TRANSACTION.objectStore(DB_PLAYLIST_STORE);
    return new Promise((resolve, reject) => {
        const REQUEST = OBJECT_STORE.getAll();
        REQUEST.onsuccess = (event: Event) => {
            const RESULTS = (event.target as IDBRequest).result;
            resolve({ results: RESULTS });
        };
        REQUEST.onerror = (event: Event) => reject((event.target as IDBRequest).error);
    });
}

export async function removePlaylistFromIndexDB(id: string) {
    const DB = await openDatabase();
    const TRANSACTION = DB.transaction(DB_PLAYLIST_STORE, 'readwrite');
    const OBJECT_STORE = TRANSACTION.objectStore(DB_PLAYLIST_STORE);
    return new Promise((resolve, reject) => {
        const REQUEST = OBJECT_STORE.delete(id);
        REQUEST.onsuccess = () => resolve({ id: id, success: true });
        REQUEST.onerror = (event: Event) => reject((event.target as IDBRequest).error);
    });
}