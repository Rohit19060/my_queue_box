import { currentCursorValue, dataStore, hasMore, page } from "./stores/videoDB";

function dateToHumanReadable(date: Date): string {
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}

function secondsToHumanReadable(seconds: number): string {
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


function isoDurationToSeconds(duration: string): number {
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



function convertToVideoIndexDB(videoResponse: VideoResponse): VideoIndexDB {
	return {
		id: videoResponse.id,
		title: videoResponse.details.snippet.title,
		description: videoResponse.details.snippet.description,
		durationSec: isoDurationToSeconds(videoResponse.details.contentDetails.duration),
		publishedAt: new Date(videoResponse.published_at),
		channelTitle: videoResponse.details.snippet.channelTitle,
		channelId: videoResponse.details.snippet.channelId,
		viewCount: videoResponse.details.statistics.viewCount,
		likeCount: videoResponse.details.statistics.likeCount,
		tags: videoResponse.details.snippet.tags,
	};
}

enum CurrentPage {
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
}

export { convertToVideoIndexDB, CurrentPage, dateToHumanReadable, isoDurationToSeconds, secondsToHumanReadable };

