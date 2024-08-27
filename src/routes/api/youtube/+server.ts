import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY as string;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

export const GET: RequestHandler = async ({ url }) => {
    const query = url.searchParams.get('query');
    if (!query) {
        return json({ error: 'Query parameter is required' }, { status: 400 });
    }
    const response = await fetch(`${YOUTUBE_API_URL}/videos?id=${query}&key=${YOUTUBE_API_KEY}&part=snippet,contentDetails,statistics&type=video`);
    if (!response.ok) {
        return json({ error: 'Failed to fetch video details' }, { status: 500 });
    }
    const data = await response.json();
    const items = data.items;
    if (items.length === 0) {
        return json({ error: 'No video found' }, { status: 404 });
    }
    return json(items[0]);
};
