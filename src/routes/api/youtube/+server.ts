import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY as string;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';
// Implement a basic in-memory cache (for demonstration purposes)

export const GET: RequestHandler = async ({ url }) => {

    const videoId = url.searchParams.get('video');
    const playlistId = url.searchParams.get('playlist');
    console.log(playlistId);
    console.log(videoId);

    if (videoId) {
        console.log("videoId");
        const response = await fetch(`${YOUTUBE_API_URL}/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=snippet,contentDetails,statistics&type=video`);
        if (!response.ok) {
            return json({ error: 'Failed to fetch video details' }, { status: 500 });
        }
        const data = await response.json();
        const video: YouTubeVideoResponse = data.items[0];
        const responseData: YouTubeVideo = {
            id: video?.snippet.resourceId?.videoId ?? video.id,
            title: video.snippet.title,
            description: video.snippet.description,
            duration: video.contentDetails.duration,
            channelTitle: video.snippet.channelTitle,
            channelId: video.snippet.channelId,
            categoryId: video.snippet.categoryId,
            tags: video.snippet.tags,
            publishedAt: video.snippet.publishedAt,
        };
        return json(responseData);
    } else if (playlistId) {
        console.log("playlistId");
        let items: YouTubeVideoResponse[] = [];
        let responseItems: YouTubeVideo[] = [];
        let nextPageToken: string | null = null;
        do {
            console.log(`${YOUTUBE_API_URL}/playlistItems?key=${YOUTUBE_API_KEY}&part=contentDetails,snippet&playlistId=${playlistId}&maxResults=50${nextPageToken ? `&pageToken=${nextPageToken}` : ""
                }`);
            const response = await fetch(
                `${YOUTUBE_API_URL}/playlistItems?key=${YOUTUBE_API_KEY}&part=contentDetails,snippet&playlistId=${playlistId}&maxResults=50${nextPageToken ? `&pageToken=${nextPageToken}` : ""
                }`,
            );
            if (!response.ok || response.status !== 200) {
                return json({ error: 'Failed to fetch video details' }, { status: 500 });
            }

            const data = await response.json();
            items = items.concat(data.items);
            nextPageToken = data.nextPageToken;
        } while (nextPageToken);

        responseItems = items.map((item: YouTubeVideoResponse) => {
            return {
                id: item.snippet.resourceId?.videoId ?? "",
                title: item.snippet.title,
                description: item.snippet.description,
                duration: item.contentDetails.duration,
                channelTitle: item.snippet.videoOwnerChannelTitle ??
                    item.snippet.channelTitle,
                channelId: item.snippet.videoOwnerChannelId ??
                    item.snippet.channelId,
                categoryId: item.snippet.categoryId,
                tags: item.snippet.tags,
                publishedAt: item.snippet.publishedAt,
            };
        });

        return json(responseItems);
    }
    return json({ error: 'Invalid request' }, { status: 400 });
};
