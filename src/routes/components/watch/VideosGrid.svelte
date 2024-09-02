<script lang="ts">
	import { SEARCH_VIDEO_STORE, VIDEO_STORE } from '$lib/stores/VideoDB';
	import Video from './Video.svelte';
	import YouTubeModal from './YouTubeModal.svelte';

	let data: App.VideoIndexDB[] = [];

	$: data = $SEARCH_VIDEO_STORE.length > 0 ? $SEARCH_VIDEO_STORE : $VIDEO_STORE;
</script>

<div class="flex flex-col gap-6 md:p-8">
	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
		{#each data as item}
			<Video {item} />
		{/each}
	</div>
</div>

<YouTubeModal />
