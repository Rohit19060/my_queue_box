import { YOUTUBE_API_KEY } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';

const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

const fetchYouTubeData = async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${YOUTUBE_API_URL}/${endpoint}`);
    if (!response.ok) throw new Error(response.statusText);
    return response.json() as Promise<T>;
};

const cache: Map<string, unknown> = new Map();

export const GET: RequestHandler = async ({ url }) => {
    if (!YOUTUBE_API_KEY) {
        return json({ error: 'YouTube API key is not set' }, { status: 500 });
    }
    const videoId = url.searchParams.get('video');
    const playlistId = url.searchParams.get('playlist');
    const searchText = url.searchParams.get('search');
    const playlistDetails = url.searchParams.get('playlistDetails');
    try {
        if (videoId) {
            return await handleVideoRequest(videoId);
        } else if (playlistId) {
            return await handlePlaylistRequest(playlistId);
        } else if (searchText) {
            return await handleSearchRequest(searchText);
        } else if (playlistDetails) {
            return await getPlayListDetails(playlistDetails);
        }
        return json({ error: 'Invalid request' }, { status: 400 });
    } catch (error) {
        return json({ error: (error as Error).message }, { status: 500 });
    }
};

// Handle video request with inlined formatting
async function handleVideoRequest(videoId: string) {
    // Check cache
    const cacheKey = `video:${videoId}`;
    if (cache.has(cacheKey)) {
        return json(cache.get(cacheKey));
    }

    const data = await fetchYouTubeData<{ items: App.VideoResult[] }>(
        `videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=snippet,contentDetails,statistics`
    );
    const video = data.items[0];
    if (!video) return json({ error: 'Video not found' }, { status: 404 });

    // Inlined formatting for video
    const formattedVideo: App.YouTubeVideo = {
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        duration: video.contentDetails?.duration ?? '',
        channelTitle: video.snippet.videoOwnerChannelTitle ?? video.snippet.channelTitle,
        channelId: video.snippet.videoOwnerChannelId ?? video.snippet.channelId,
        categoryId: video.snippet.categoryId ?? '',
        tags: video.snippet.tags ?? [],
        publishedAt: video.snippet.publishedAt,
    };

    // Store in cache
    cache.set(cacheKey, formattedVideo);

    return json(formattedVideo);
}

// Handle playlist request with inlined formatting
async function handlePlaylistRequest(playlistId: string) {
    let items: App.PlaylistItem[] = [];
    let nextPageToken: string | undefined;

    do {
        const data = await fetchYouTubeData<{ items: App.PlaylistItem[]; nextPageToken?: string }>(
            `playlistItems?playlistId=${playlistId}&key=${YOUTUBE_API_KEY}&part=contentDetails,snippet&maxResults=50${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`
        );
        items = items.concat(data.items);
        nextPageToken = data.nextPageToken;
    } while (nextPageToken);

    const formattedItems = items.map((item) => ({
        id: item.contentDetails.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        duration: '',
        channelTitle: item.snippet.videoOwnerChannelTitle,
        channelId: item.snippet.videoOwnerChannelId,
        categoryId: '',
        tags: [],
        publishedAt: item.contentDetails.videoPublishedAt,
    }));

    return json(formattedItems);
}

// Handle search request with inlined formatting
async function handleSearchRequest(searchText: string) {
    const data = await fetchYouTubeData<{ items: App.SearchResult[] }>(
        `search?part=snippet&key=${YOUTUBE_API_KEY}&type=video&maxResults=10&q=${searchText}`
    );

    // Inlined formatting for search result
    const formattedItems = data.items.map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        duration: '', // No duration info in search results
        channelTitle: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
        categoryId: '',
        tags: [],
        publishedAt: item.snippet.publishedAt,
    }));

    return json(formattedItems);
}

async function getPlayListDetails(id: string) {
    const data = await fetchYouTubeData<{ items: App.Playlist[] }>(
        `playlists?id=${id}&key=${YOUTUBE_API_KEY}&part=snippet`
    );
    const playlist = data.items[0];
    if (!playlist) return json({ error: 'Video not found' }, { status: 404 });

    return json(playlist);
}
