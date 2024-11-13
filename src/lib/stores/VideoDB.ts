import { convertToVideoIndexDB } from '$lib';
import { writable } from 'svelte/store';
import { openDatabase } from './Common';

const ITEMS_PER_PAGE = 40;

export const DB_VIDEO_STORE = 'videoStore';


export enum SortOptions {
	Title = 'titleIndex',
	Duration = 'durationIndex',
	Channel = 'channelIndex',
	PublishedAt = 'publishedAtIndex'
}

export const SortOptionDetails: {
	[key in SortOptions]: { keypath: string[] | string; str: string };
} = {
	[SortOptions.Title]: { keypath: 'title', str: 'Title' },
	[SortOptions.Duration]: { keypath: ['durationSec', 'id'], str: 'Duration' },
	[SortOptions.Channel]: { keypath: ['channelTitle', 'id'], str: 'Channel' },
	[SortOptions.PublishedAt]: { keypath: ['publishedAtStr', 'id'], str: 'Published' }
};

export const TOTAL_VIDEO_COUNT = writable(0);
export const WATCHED_VIDEO_COUNT = writable(0);
export const SORT_BY = writable(SortOptions.PublishedAt);
export const IS_DESC = writable(true);
export const VIDEO_STORE = writable<App.VideoIndexDB[]>([]);
export const SEARCH_TEXT = writable('');
export const HAS_MORE = writable(true);
export const CURRENT_CURSOR = writable<IDBValidKey | null>(null);
export const CURRENT_VIDEO_ID = writable<App.VideoIndexDB>();
export const IS_VIDEO_MODAL_OPEN = writable(false);
export const IS_PLAYLIST_MODAL_OPEN = writable(false);
export const IS_PLAYLIST_MODAL_TYPE = writable('PLAYLIST');
export const IS_PLAY_VIDEOS = writable(false);
export const PLAYLIST_VIDEO_LIST = writable<App.YouTubeVideo[]>([]);
export const SEARCHED_VIDEO_DETAILS = writable<App.YouTubeVideo | null>(null);

export async function fetchPaginatedData(
	cursorValue: IDBValidKey | null,
	sortBy: SortOptions = SortOptions.PublishedAt,
	isDesc: boolean = true
): Promise<{ results: App.VideoIndexDB[]; nextCursorValue: IDBValidKey | null }> {
	const DB = await openDatabase();
	const TRANSACTION = DB.transaction(DB_VIDEO_STORE, 'readonly');
	const OBJECTSTORE = TRANSACTION.objectStore(DB_VIDEO_STORE);
	const INDEX = OBJECTSTORE.index(sortBy);
	const DIRECTION = isDesc ? 'prev' : 'next';
	const RESULTS: App.VideoIndexDB[] = [];
	let counter = 0;
	let nextCursorValue: IDBValidKey | null = null;

	return new Promise((resolve, reject) => {
		const OPEN_REQUEST =
			cursorValue != null
				? INDEX.openCursor(
					DIRECTION == 'prev'
						? IDBKeyRange.upperBound(cursorValue, true)
						: IDBKeyRange.lowerBound(cursorValue, true),
					DIRECTION
				)
				: INDEX.openCursor(null, DIRECTION);

		OPEN_REQUEST.onsuccess = (event: Event) => {
			const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
			if (cursor && counter < ITEMS_PER_PAGE) {
				RESULTS.push(cursor.value);
				counter++;
				nextCursorValue = cursor.key;
				cursor.continue();
			} else {
				resolve({ results: RESULTS, nextCursorValue });
			}
		};
		OPEN_REQUEST.onerror = (event: Event) => reject((event.target as IDBRequest).error);
	});
}

export async function searchVideos(
	cursorValue: IDBValidKey | null,
	sortBy: string = 'titleIndex',
	isDesc: boolean = true,
	searchText: string
): Promise<{ results: App.VideoIndexDB[]; nextCursorValue: IDBValidKey | null }> {
	const DB = await openDatabase();
	const TRANSACTION = DB.transaction(DB_VIDEO_STORE, 'readonly');
	const OBJECT_STORE = TRANSACTION.objectStore(DB_VIDEO_STORE);
	const INDEX = OBJECT_STORE.index(sortBy);
	const DIRECTION = isDesc ? 'prev' : 'next';
	const RESULTS: App.VideoIndexDB[] = [];
	let counter = 0;
	let nextCursorValue: IDBValidKey | null = null;
	return new Promise((resolve, reject) => {
		const OPEN_REQUEST =
			cursorValue != null
				? INDEX.openCursor(
					DIRECTION == 'prev'
						? IDBKeyRange.upperBound(cursorValue, true)
						: IDBKeyRange.lowerBound(cursorValue, true),
					DIRECTION
				)
				: INDEX.openCursor(null, DIRECTION);

		const SEARCH_TEXT = searchText.toLowerCase();
		OPEN_REQUEST.onsuccess = (event: Event) => {
			const CURSOR = (event.target as IDBRequest<IDBCursorWithValue>).result;
			if (CURSOR && counter < ITEMS_PER_PAGE) {
				const video = CURSOR.value as App.VideoIndexDB;
				if (
					video.title.toLowerCase().includes(SEARCH_TEXT) ||
					video.channelTitle.toLowerCase().includes(SEARCH_TEXT)
				) {
					RESULTS.push(video);
					counter++;
				}
				nextCursorValue = CURSOR.key;
				CURSOR.continue();
			} else {
				resolve({ results: RESULTS, nextCursorValue });
			}
		};
		OPEN_REQUEST.onerror = (event: Event) => reject((event.target as IDBRequest).error);
	});
}

export async function topVideos(): Promise<App.VideoIndexDB[]> {
	const DB = await openDatabase();
	const TRANSACTION = DB.transaction(DB_VIDEO_STORE, 'readonly');
	const OBJECT_STORE = TRANSACTION.objectStore(DB_VIDEO_STORE);
	const INDEX = OBJECT_STORE.index('publishedAtIndex');
	const RESULTS: App.VideoIndexDB[] = [];
	return new Promise((resolve, reject) => {
		const OPEN_REQUEST = INDEX.openCursor(null, 'prev');
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

export async function addVideoToIndexDB(video: App.YouTubeVideo): Promise<App.VideoIndexDB | null> {
	let tempVideo = video;
	if (!tempVideo.duration) {
		const response = await fetch(`/api/youtube?video=${encodeURIComponent(tempVideo.id)}`);
		const data = await response.json();
		if (!response.ok) {
			throw new Error(data.error);
		}
		tempVideo = data;
	}
	const DB = await openDatabase();
	const TRANSACTION = DB.transaction(DB_VIDEO_STORE, 'readwrite');
	const OBJECT_STORE = TRANSACTION.objectStore(DB_VIDEO_STORE);
	return new Promise((resolve, reject) => {
		const CONVERTED_VIDEO = convertToVideoIndexDB(tempVideo);
		const REQUEST = OBJECT_STORE.put(CONVERTED_VIDEO);
		REQUEST.onsuccess = () => resolve(CONVERTED_VIDEO);
		REQUEST.onerror = (event: Event) => reject((event.target as IDBRequest).error);
	});
}

export async function removeVideoFromIndexDB(id: string) {
	const DB = await openDatabase();
	const TRANSACTION = DB.transaction(DB_VIDEO_STORE, 'readwrite');
	const OBJECT_STORE = TRANSACTION.objectStore(DB_VIDEO_STORE);
	return new Promise((resolve, reject) => {
		const REQUEST = OBJECT_STORE.delete(id);
		REQUEST.onsuccess = () => resolve({ id: id, success: true });
		REQUEST.onerror = (event: Event) => reject((event.target as IDBRequest).error);
	});
}

export async function setVideoAsWatched(id: string, watched: boolean): Promise<void> {
	const DB = await openDatabase();
	const TRANSACTION = DB.transaction(DB_VIDEO_STORE, 'readwrite');
	const OBJECT_STORE = TRANSACTION.objectStore(DB_VIDEO_STORE);
	return new Promise((resolve, reject) => {
		const REQUEST = OBJECT_STORE.get(id);
		REQUEST.onsuccess = (event: Event) => {
			const VIDEO = (event.target as IDBRequest).result;
			if (VIDEO) {
				VIDEO.watched = watched;
				const putRequest = OBJECT_STORE.put(VIDEO);
				putRequest.onsuccess = () => resolve();
				putRequest.onerror = (event: Event) => reject((event.target as IDBRequest).error);
			} else {
				reject(new Error(`Video with id ${id} not found.`));
			}
		};
		REQUEST.onerror = (event: Event) => reject((event.target as IDBRequest).error);
	});
}

export async function storeDataInIndexedDB(data: App.VideoJsonResponse[]): Promise<void> {
	const DB = await openDatabase();
	const TRANSACTION = DB.transaction(DB_VIDEO_STORE, 'readwrite');
	const OBJECT_STORE = TRANSACTION.objectStore(DB_VIDEO_STORE);
	return new Promise((resolve, reject) => {
		data.forEach((item) => {
			const convertedItem = convertToVideoIndexDB(item);
			OBJECT_STORE.put(convertedItem);
		});
		TRANSACTION.oncomplete = () => resolve();
		TRANSACTION.onerror = (event: Event) => reject((event.target as IDBRequest).error);
	});
}

export async function isAlreadyThere(videoId: string): Promise<boolean> {
	const DB = await openDatabase();
	const TRANSACTION = DB.transaction(DB_VIDEO_STORE, 'readonly');
	const OBJECT_STORE = TRANSACTION.objectStore(DB_VIDEO_STORE);
	return new Promise((resolve, reject) => {
		const REQUEST = OBJECT_STORE.get(videoId);
		REQUEST.onsuccess = (event: Event) => {
			const VIDEO = (event.target as IDBRequest).result;
			resolve(!!VIDEO);
		};
		REQUEST.onerror = (event: Event) => reject((event.target as IDBRequest).error);
	});
}