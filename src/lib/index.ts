// place files you want to import through the `$lib` alias in this folder.

function convertToVideoIndexDB(videoResponse: VideoResponse): VideoIndexDB {
	return {
		id: videoResponse.id,
		title: videoResponse.details.snippet.title,
		description: videoResponse.details.snippet.description,
		duration: videoResponse.details.contentDetails.duration,
		channelTitle: videoResponse.details.snippet.channelTitle,
		channelId: videoResponse.details.snippet.channelId,
		viewCount: videoResponse.details.statistics.viewCount,
		likeCount: videoResponse.details.statistics.likeCount,
		tags: videoResponse.details.snippet.tags,
	};
}

export { convertToVideoIndexDB };
