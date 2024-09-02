import { describe, expect, it } from 'vitest';
import {
	dateToHumanReadable,
	secondsToHumanReadable,
	timeAgo,
	isoDurationToSeconds,
	convertToVideoIndexDB,
	CurrentPage,
	YouTubeIdType,
	setSpaPage,
	extractYouTubeId
} from './index';

describe('dateToHumanReadable', () => {
	it('should convert date to human readable format', () => {
		const date = new Date('2023-01-01');
		const result = dateToHumanReadable(date);
		expect(result).toBe('January 1, 2023');
	});
});

describe('secondsToHumanReadable', () => {
	it('should convert seconds to human readable format', () => {
		const result = secondsToHumanReadable(3661);
		expect(result).toBe('1:01:01');
	});
});

describe('timeAgo', () => {
	it('should return the correct time ago string', () => {
		const date = new Date();
		date.setFullYear(date.getFullYear() - 1);
		const result = timeAgo(date);
		expect(result).toBe('1 year ago');
	});
});

describe('isoDurationToSeconds', () => {
	it('should convert ISO 8601 duration to seconds', () => {
		const result = isoDurationToSeconds('PT1H1M1S');
		expect(result).toBe(3661);
	});
});

describe('convertToVideoIndexDB', () => {
	it('should convert VideoJsonResponse to VideoIndexDB', () => {
		const videoResponse = {
			id: 'abcd1234',
			published_at: '2023-01-01T00:00:00Z',
			details: {
				id: 'abcd1234',
				snippet: {
					title: 'Test Video',
					channelId: 'channel1234',
					channelTitle: 'Test Channel',
					description: 'Test Description',
					categoryId: '22',
					tags: ['test', 'video']
				},
				contentDetails: {
					duration: 'PT1H1M1S'
				}
			}
		};
		const result = convertToVideoIndexDB(videoResponse);
		expect(result).toEqual({
			categoryId: '22',
			id: 'abcd1234',
			title: 'Test Video',
			description: 'Test Description',
			durationSec: 3661,
			durationSecStr: 'PT1H1M1S',
			publishedAt: new Date('2023-01-01T00:00:00Z'),
			publishedAtStr: '2023-01-01T00:00:00Z',
			channelTitle: 'Test Channel',
			channelId: 'channel1234',
			tags: ['test', 'video'],
			watched: false
		});
	});
});

describe('CurrentPage', () => {
	it('should have correct enum values', () => {
		expect(CurrentPage.Home).toBe(0);
		expect(CurrentPage.Read).toBe(1);
		expect(CurrentPage.Watch).toBe(2);
	});
});

describe('YouTubeIdType', () => {
	it('should have correct enum values', () => {
		expect(YouTubeIdType.Video).toBe('VIDEO');
		expect(YouTubeIdType.Playlist).toBe('PLAYLIST');
		expect(YouTubeIdType.Unknown).toBe('UNKNOWN');
	});
});

describe('setSpaPage', () => {
	it('should set the SPA page correctly', () => {
		setSpaPage(CurrentPage.Watch);
		expect(localStorage.getItem('spaPage')).toBe(CurrentPage.Watch.toString());
	});
});

describe('extractYouTubeId', () => {
	it('should extract video ID from a standard YouTube URL', () => {
		const url = 'https://www.youtube.com/watch?v=abcd1234xyz';
		const result = extractYouTubeId(url);
		expect(result).toEqual({ type: YouTubeIdType.Video, id: 'abcd1234xyz' });
	});

	it('should extract playlist ID from a YouTube URL', () => {
		const url = 'https://www.youtube.com/playlist?list=PLabcd1234xyz';
		const result = extractYouTubeId(url);
		expect(result).toEqual({ type: YouTubeIdType.Playlist, id: 'PLabcd1234xyz' });
	});

	it('should return unknown type for invalid YouTube URL', () => {
		const url = 'https://www.example.com';
		const result = extractYouTubeId(url);
		expect(result).toEqual({ type: YouTubeIdType.Unknown, id: 'https://www.example.com' });
	});

	it('should return video ID when only video ID is provided', () => {
		const id = 'abcd1234xyz';
		const result = extractYouTubeId(id);
		expect(result).toEqual({ type: YouTubeIdType.Video, id: 'abcd1234xyz' });
	});

	it('should return playlist ID when only playlist ID is provided', () => {
		const id = 'PLabcd1234xyz';
		const result = extractYouTubeId(id);
		expect(result).toEqual({ type: YouTubeIdType.Playlist, id: 'PLabcd1234xyz' });
	});
});
