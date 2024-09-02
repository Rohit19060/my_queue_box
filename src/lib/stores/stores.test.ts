import { describe, it, expect } from 'vitest';
import { openDatabase } from './Common';
import { PAGE, totalVideoCountFn } from './SpaStore';
import { 
    DB_VIDEO_STORE, 
    SortOptions, 
    SortOptionDetails, 
    SORT_BY, 
    IS_DESC, 
    VIDEO_STORE, 
    SEARCH_VIDEO_STORE, 
    HAS_MORE, 
    CURRENT_CURSOR, 
    CURRENT_VIDEO_ID, 
    IS_VIDEO_MODAL_OPEN, 
    IS_PLAYLIST_MODAL_OPEN, 
    PLAYLIST_VIDEO_LIST, 
    SEARCHED_VIDEO_DETAILS, 
    API_ERROR, 
    storeDataInIndexedDB, 
    fetchPaginatedData, 
    searchVideos, 
    addVideoToIndexDB, 
    removeVideoFromIndexDB, 
    setVideoAsWatched 
} from './VideoDB';

describe('Common Store', () => {
    it('should open the database', async () => {
        const db = await openDatabase();
        expect(db).toBeDefined();
        expect(db.name).toBe('kings-library');
    });
});

describe('SpaStore', () => {
    it('should have a default page value', () => {
        expect(PAGE).toBeDefined();
    });

    it('should return total video count', async () => {
        const count = await totalVideoCountFn();
        expect(count).toBeGreaterThanOrEqual(0);
    });
});

describe('VideoDB Store', () => {
    it('should have default values for stores', () => {
        expect(SORT_BY).toBeDefined();
        expect(IS_DESC).toBeDefined();
        expect(VIDEO_STORE).toBeDefined();
        expect(SEARCH_VIDEO_STORE).toBeDefined();
        expect(HAS_MORE).toBeDefined();
        expect(CURRENT_CURSOR).toBeDefined();
        expect(CURRENT_VIDEO_ID).toBeDefined();
        expect(IS_VIDEO_MODAL_OPEN).toBeDefined();
        expect(IS_PLAYLIST_MODAL_OPEN).toBeDefined();
        expect(PLAYLIST_VIDEO_LIST).toBeDefined();
        expect(SEARCHED_VIDEO_DETAILS).toBeDefined();
        expect(API_ERROR).toBeDefined();
    });

    it('should store data in IndexedDB', async () => {
        const data = [
            {
                id: '1',
                details: {
                    id: '1',
                    snippet: {
                        title: 'Test Video',
                        channelId: '123',
                        channelTitle: 'Test Channel',
                        description: 'Test Description',
                        categoryId: '1',
                        tags: ['test']
                    },
                    contentDetails: {
                        duration: 'PT1M30S'
                    }
                },
                published_at: '2023-01-01T00:00:00Z'
            }
        ];
        await storeDataInIndexedDB(data);
        const db = await openDatabase();
        const transaction = db.transaction(DB_VIDEO_STORE, 'readonly');
        const objectStore = transaction.objectStore(DB_VIDEO_STORE);
        const request = objectStore.get('1');
        request.onsuccess = () => {
            expect(request.result).toBeDefined();
            expect(request.result.id).toBe('1');
        };
    });

    it('should fetch paginated data', async () => {
        const { results, nextCursorValue } = await fetchPaginatedData(null, SortOptions.Title, true);
        expect(results).toBeDefined();
        expect(Array.isArray(results)).toBe(true);
    });

    it('should search videos', async () => {
        const { results, nextCursorValue } = await searchVideos(null, SortOptions.Title, true, 'Test');
        expect(results).toBeDefined();
        expect(Array.isArray(results)).toBe(true);
    });

    it('should add video to IndexedDB', async () => {
        const video = {
            id: '2',
            title: 'Test Video 2',
            description: 'Test Description 2',
            duration: 'PT2M',
            channelTitle: 'Test Channel 2',
            channelId: '456',
            categoryId: '2',
            tags: ['test2'],
            publishedAt: '2023-01-02T00:00:00Z'
        };
        const result = await addVideoToIndexDB(video);
        expect(result).toBeDefined();
        expect(result.id).toBe('2');
    });

    it('should remove video from IndexedDB', async () => {
        await removeVideoFromIndexDB('2');
        const db = await openDatabase();
        const transaction = db.transaction(DB_VIDEO_STORE, 'readonly');
        const objectStore = transaction.objectStore(DB_VIDEO_STORE);
        const request = objectStore.get('2');
        request.onsuccess = () => {
            expect(request.result).toBeUndefined();
        };
    });

    it('should set video as watched', async () => {
        await setVideoAsWatched('1', true);
        const db = await openDatabase();
        const transaction = db.transaction(DB_VIDEO_STORE, 'readonly');
        const objectStore = transaction.objectStore(DB_VIDEO_STORE);
        const request = objectStore.get('1');
        request.onsuccess = () => {
            expect(request.result).toBeDefined();
            expect(request.result.watched).toBe(true);
        };
    });
});
