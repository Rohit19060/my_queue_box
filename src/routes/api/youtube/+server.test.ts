import { describe, it, expect } from 'vitest';
import { GET } from './+server';
import { json } from '@sveltejs/kit';

describe('GET /api/youtube', () => {
	it('should return video details for a valid video ID', async () => {
		const url = new URL('http://localhost/api/youtube?video=abcd1234xyz');
		const response = await GET({ url });
		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data).toHaveProperty('id', 'abcd1234xyz');
		expect(data).toHaveProperty('title');
		expect(data).toHaveProperty('description');
		expect(data).toHaveProperty('duration');
		expect(data).toHaveProperty('channelTitle');
		expect(data).toHaveProperty('channelId');
		expect(data).toHaveProperty('categoryId');
		expect(data).toHaveProperty('tags');
		expect(data).toHaveProperty('publishedAt');
	});

	it('should return playlist details for a valid playlist ID', async () => {
		const url = new URL('http://localhost/api/youtube?playlist=abcd1234xyz');
		const response = await GET({ url });
		expect(response.status).toBe(200);
		const data = await response.json();
		expect(Array.isArray(data)).toBe(true);
		expect(data.length).toBeGreaterThan(0);
		data.forEach((item) => {
			expect(item).toHaveProperty('id');
			expect(item).toHaveProperty('title');
			expect(item).toHaveProperty('description');
			expect(item).toHaveProperty('duration');
			expect(item).toHaveProperty('channelTitle');
			expect(item).toHaveProperty('channelId');
			expect(item).toHaveProperty('categoryId');
			expect(item).toHaveProperty('tags');
			expect(item).toHaveProperty('publishedAt');
		});
	});

	it('should return an error for an invalid request', async () => {
		const url = new URL('http://localhost/api/youtube');
		const response = await GET({ url });
		expect(response.status).toBe(400);
		const data = await response.json();
		expect(data).toHaveProperty('error', 'Invalid request');
	});
});
