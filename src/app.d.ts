// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface VideoIndexDB {
			id: string;
			title: string;
			description: string;
			durationSec: number;
			durationSecStr: string;
			channelTitle: string;
			channelId: string;
			categoryId: string;
			tags: string[];
			publishedAt: Date;
			publishedAtStr: string;
			watched: boolean;
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
			},
		}


		interface YouTubeVideoResponse {
			id: string;
			snippet: {
				title: string;
				channelId: string;
				channelTitle: string;
				description: string;
				categoryId: string;
				tags: string[];
				publishedAt: string;
				videoOwnerChannelTitle: string | null;
				videoOwnerChannelId: string | null;
				resourceId: {
					videoId: string | null;
				} | null;
			};
			contentDetails: {
				duration: string;
				videoId: string | null;
				videoPublishedAt: string | null;
			};
		}

		interface YouTubeVideo {
			id: string;
			title: string;
			description: string;
			duration: string;
			channelTitle: string;
			channelId: string;
			categoryId: string;
			tags: string[];
			publishedAt: string;
		}
		type AfterSort = (sort: SortOptions) => void;
		type OnSearch = (search: string) => void;

		interface YouTubeIdResult {
			type: YouTubeIdType;
			id: string;
		}

		interface ReadIndexDB {
			id: number;
			title: string;
			description: string;
			url: string;
		}
	}
}

export { };
