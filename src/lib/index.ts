import { PAGE } from "./stores/MainStore";
import { CURRENT_CURSOR, HAS_MORE, VIDEO_STORE } from "./stores/VideoDB";

export function dateToHumanReadable(date: Date): string {
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}

export function secondsToHumanReadable(seconds: number): string {
	// Calculate hours, minutes, and seconds
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = seconds % 60;

	// Format the values to ensure two digits for minutes and seconds
	const hoursStr = hours > 0 ? `${hours}:` : '';
	const minutesStr = `${String(minutes).padStart(2, '0')}:`;
	const secondsStr = String(secs).padStart(2, '0');

	return `${hoursStr}${minutesStr}${secondsStr}`;
}

export function timeAgo(date: Date): string {
	const now = new Date();
	const differenceInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
	const minutes = Math.floor(differenceInSeconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	const weeks = Math.floor(days / 7);
	const months = Math.floor(weeks / 4.35);
	const years = Math.floor(months / 12);
	if (years > 0) {
		return years === 1 ? "1 year ago" : `${years} years ago`;
	} else if (months > 0) {
		return months === 1 ? "1 month ago" : `${months} months ago`;
	} else if (weeks > 0) {
		return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
	} else if (days > 0) {
		return days === 1 ? "1 day ago" : `${days} days ago`;
	} else if (hours > 0) {
		return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
	} else if (minutes > 0) {
		return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
	} else {
		return "Just now";
	}
}

export function isoDurationToSeconds(duration: string): number {
	// Extended regex to support days as well
	const regex = /^P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
	const matches = regex.exec(duration);

	if (!matches) {
		throw new Error('Invalid ISO 8601 duration format');
	}

	const days = parseInt(matches[1] || '0', 10);
	const hours = parseInt(matches[2] || '0', 10);
	const minutes = parseInt(matches[3] || '0', 10);
	const seconds = parseInt(matches[4] || '0', 10);

	return (days * 86400) + (hours * 3600) + (minutes * 60) + seconds;
}


export function convertToVideoIndexDB(videoResponse: App.VideoJsonResponse | App.YouTubeVideo): App.VideoIndexDB {
	if ('details' in videoResponse) {
		return {
			categoryId: videoResponse.details.snippet.categoryId,
			id: videoResponse.id,
			title: videoResponse.details.snippet.title,
			description: videoResponse.details.snippet.description,
			durationSec: isoDurationToSeconds(videoResponse.details.contentDetails.duration),
			durationSecStr: videoResponse.details.contentDetails.duration,
			publishedAt: new Date(videoResponse.published_at),
			publishedAtStr: videoResponse.published_at,
			channelTitle: videoResponse.details.snippet.channelTitle,
			channelId: videoResponse.details.snippet.channelId,
			tags: videoResponse.details.snippet.tags,
			watched: false,
		}
	}
	else {
		return {
			categoryId: videoResponse.categoryId,
			id: videoResponse.id,
			title: videoResponse.title,
			description: videoResponse.description,
			durationSec: isoDurationToSeconds(videoResponse.duration),
			durationSecStr: videoResponse.duration,
			publishedAt: new Date(videoResponse.publishedAt),
			publishedAtStr: videoResponse.publishedAt,
			channelTitle: videoResponse.channelTitle,
			channelId: videoResponse.channelId,
			tags: videoResponse.tags,
			watched: false,
		}
	}
}

export enum CurrentPage {
	Home = 0,
	Read = 1,
	Watch = 2
}


export enum YouTubeIdType {
	Video = "VIDEO",
	Playlist = "PLAYLIST",
	Search = "SEARCH"
}

export function setSpaPage(x: CurrentPage) {
	VIDEO_STORE.update(() => []);
	CURRENT_CURSOR.set(null);
	HAS_MORE.set(true);
	PAGE.set(x);
	localStorage.setItem('spaPage', x.toString());
}

export function extractYouTubeId(urlOrId: string): App.YouTubeIdResult {
	// Regular expression to match YouTube video IDs from full URLs
	const videoUrlExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;

	// Regular expression to match YouTube playlist IDs from full URLs
	const playlistUrlExp = /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/playlist\?list=([a-zA-Z0-9_-]+)/i;

	// Regular expression to match standalone playlist IDs
	const playlistIdExp = /^PL[a-zA-Z0-9_-]+$/;

	// Regular expression to match standalone video IDs
	const videoIdExp = /^[a-zA-Z0-9_-]{11}$/;

	// Check if the input matches the video URL pattern
	const videoUrlMatch = urlOrId.match(videoUrlExp);
	if (videoUrlMatch) {
		return { type: YouTubeIdType.Video, id: videoUrlMatch[1] };
	}

	// Check if the input matches the playlist URL pattern
	const playlistUrlMatch = urlOrId.match(playlistUrlExp);
	if (playlistUrlMatch) {
		return { type: YouTubeIdType.Playlist, id: playlistUrlMatch[1] };
	}

	// Check if the input is a standalone playlist ID (starts with "PL")
	if (playlistIdExp.test(urlOrId)) {
		return { type: YouTubeIdType.Playlist, id: urlOrId };
	}

	// Check if the input is a standalone video ID
	if (videoIdExp.test(urlOrId)) {
		return { type: YouTubeIdType.Video, id: urlOrId };
	}

	// If none of the above match, consider it as a search string
	return { type: YouTubeIdType.Search, id: urlOrId };
}