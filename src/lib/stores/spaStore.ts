import { writable } from 'svelte/store';
import { openDatabase } from './Common';
import { DB_VIDEO_STORE } from './VideoDB';

export const PAGE = writable(
	typeof window !== 'undefined' ? parseInt(localStorage.getItem('spaPage') || '0') : 0
);

export async function totalVideoCountFn(): Promise<number> {
	const db = await openDatabase();
	const transaction = db.transaction(DB_VIDEO_STORE, 'readonly');
	const objectStore = transaction.objectStore(DB_VIDEO_STORE);
	return new Promise((resolve, reject) => {
		const request = objectStore.count();
		request.onsuccess = () => resolve(request.result);
		request.onerror = (event: Event) => reject((event.target as IDBRequest).error);
	});
}
