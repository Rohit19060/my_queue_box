import { currentCursorValue, dataStore, hasMore, page } from "./stores/videoDB";

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
	const regex = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
	const matches = regex.exec(duration);

	if (!matches) {
		throw new Error('Invalid ISO 8601 duration format');
	}

	const hours = parseInt(matches[1] || '0', 10);
	const minutes = parseInt(matches[2] || '0', 10);
	const seconds = parseInt(matches[3] || '0', 10);

	return (hours * 3600) + (minutes * 60) + seconds;
}

function sanitizeStringKey(key: string): string {
	let sanitizedKey = key.trim().toLowerCase();
	sanitizedKey = sanitizedKey.replace(/[^\w\s]/gi, '');
	return sanitizedKey.trim();
}

export function convertToVideoIndexDB(videoResponse: VideoJsonResponse): VideoIndexDB {
	return {
		categoryId: videoResponse.details.snippet.categoryId,
		id: videoResponse.id,
		title: sanitizeStringKey(videoResponse.details.snippet.title),
		description: videoResponse.details.snippet.description,
		durationSec: isoDurationToSeconds(videoResponse.details.contentDetails.duration),
		durationSecStr: videoResponse.details.contentDetails.duration,
		publishedAt: new Date(videoResponse.published_at),
		publishedAtStr: videoResponse.published_at,
		channelTitle: videoResponse.details.snippet.channelTitle,
		channelId: videoResponse.details.snippet.channelId,
		tags: videoResponse.details.snippet.tags,
	};
}

export enum CurrentPage {
	Home = 0,
	Read = 1,
	Watch = 2,
	Settings = 3,
	About = 4,
	Contact = 5,
	Login = 6,
	Register = 7,
	Logout = 8,
}

export function setSpaPage(x: CurrentPage) {
	dataStore.update(() => []);
	currentCursorValue.set(null);
	hasMore.set(true);
	page.set(x);
	localStorage.setItem('spaPage', x.toString());
}

export function urlToYouTubeId(urlOrId: string): string {
	// Regular expression to match YouTube video IDs
	const videoIdExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;

	// Check if the input matches the video ID pattern
	const match = urlOrId.match(videoIdExp);

	// If there's a match, return the video ID, otherwise return the input as-is
	return match ? match[1] : urlOrId;
}



