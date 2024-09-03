import { writable } from 'svelte/store';
import { openDatabase } from './Common';
import { DB_VIDEO_STORE } from './VideoDB';

export const PAGE = writable(
	typeof window !== 'undefined' ? parseInt(localStorage.getItem('spaPage') || '0') : 0
);

export async function totalAndWatchedVideoCountFn(): Promise<{ total: number; watched: number }> {
	const db = await openDatabase();
	const transaction = db.transaction(DB_VIDEO_STORE, 'readonly');
	const objectStore = transaction.objectStore(DB_VIDEO_STORE);
	return new Promise((resolve, reject) => {
		const totalRequest = objectStore.count();
		const watchedRequest = objectStore.openCursor();
		let watchedCount = 0;
		totalRequest.onsuccess = () => {
			watchedRequest.onsuccess = (event: Event) => {
				const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
				if (cursor) {
					const video = cursor.value;
					if (!video.watched) {
						watchedCount++;
					}
					cursor.continue();
				} else {
					resolve({ total: totalRequest.result, watched: watchedCount });
				}
			};
			watchedRequest.onerror = (event: Event) => reject((event.target as IDBRequest).error);
		};
		totalRequest.onerror = (event: Event) => reject((event.target as IDBRequest).error);
	});
}

