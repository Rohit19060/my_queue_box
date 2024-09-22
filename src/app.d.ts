// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface ReadIndexDB {
			id: number;
			title: string;
			description: string;
			url: string;
		}

		interface PlaylistIndexDB {
			id: string;
			name: string;
		}
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


		type AfterSort = (sort: SortOptions) => void;

		type OnSearch = (search: string) => void;

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

		interface VideoResult {
			id: string;
			snippet: {
				title: string;
				description: string;
				publishedAt: string;
				channelTitle: string;
				channelId: string;
				tags?: string[];
				videoOwnerChannelTitle?: string;
				videoOwnerChannelId?: string;
				categoryId?: string;
			};
			contentDetails?: {
				duration: string;
			};
			statistics?: {
				viewCount: string;
				likeCount: string;
			};
		}

		interface PlaylistItem {
			snippet: {
				title: string;
				description: string;
				videoOwnerChannelTitle: string;
				videoOwnerChannelId: string;
				resourceId: {
					kind: string;
					videoId: string;
				}
			};
			contentDetails: {
				videoId: string;
				videoPublishedAt: string;
			};

		}
		interface Playlist {
			id: string;
			snippet: {
				title: string;
				description: string;
				channelTitle: string;
				channelId: string;
				publishedAt: string;
			}
		}

		interface SearchResult {
			id: {
				videoId: string;
			};
			snippet: {
				title: string;
				description: string;
				channelTitle: string;
				channelId: string;
				publishedAt: string;
			};
		}

		interface YouTubeIdResult {
			id: string;
			type: YouTubeIdType;
		}
	}
}

export { };
