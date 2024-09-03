// utils.test.ts
import { urlToYouTubeId } from '$lib';
import { describe, expect, it } from 'vitest';

describe('extractYouTubeVideoId', () => {
	it('should extract video ID from a standard YouTube URL', () => {
		const url = 'https://www.youtube.com/watch?v=abcd1234xyz';
		const result = urlToYouTubeId(url);
		expect(result).toBe('abcd1234xyz');
	});

	it('should extract video ID from a shortened YouTube URL', () => {
		const url = 'https://youtu.be/abcd1234xyz';
		const result = urlToYouTubeId(url);
		expect(result).toBe('abcd1234xyz');
	});

	it('should return the video ID if it is already an ID', () => {
		const id = 'abcd1234xyz';
		const result = urlToYouTubeId(id);
		expect(result).toBe('abcd1234xyz');
	});

	it('should return the input if it does not match a YouTube URL or ID pattern', () => {
		const input = 'not_a_youtube_url_or_id';
		const result = urlToYouTubeId(input);
		expect(result).toBe('not_a_youtube_url_or_id');
	});
});
