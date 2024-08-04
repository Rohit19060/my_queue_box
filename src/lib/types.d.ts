// global.d.ts
declare global {
	interface VideoIndexDB {
		id: string;
		title: string;
		description: string;
		durationSec: number;
		channelTitle: string;
		channelId: string;
		viewCount: string;
		likeCount: string;
		tags: string[];
		publishedAt: DateTime;
	}
	interface VideoResponse {
		id: string;
		published_at: string;
		details: {
			id: string;
			snippet: {
				title: string;
				channelId: string;
				channelTitle: string;
				description: string;
				categoryId: string;
				tags: string[];
			},
			contentDetails: {
				duration: string;
			},

			statistics: {
				viewCount: string;
				likeCount: string;
			},
		},
	}



}

export { }; // Ensure this file is a module

