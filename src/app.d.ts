// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
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
		interface VideoJsonResponse {
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

		interface YouTubeVideo {
			id: string;
			snippet: {
				title: string;
				channelId: string;
				channelTitle: string;
				description: string;
				categoryId: string;
				tags: string[];
				thumbnails: {
					maxres: {
						url: string;
					}
				}
			},
			contentDetails: {
				duration: string;
			},
			statistics: {
				viewCount: string;
				likeCount: string;
			},
		}
	}
}

export { };
