<script lang="ts">
	import { SEARCH_TEXT, VIDEO_STORE } from '$lib/stores/VideoDB';
	import Video from './Video.svelte';
</script>

{#if $VIDEO_STORE.length > 0}
	<div class="p-3 md:p-5 max-auto">
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
			{#each $VIDEO_STORE as video}
				<Video {video} />
			{/each}
		</div>
	</div>
{:else if $SEARCH_TEXT.length > 0}
	<div
		class="flex flex-col items-center justify-center min-h-[400px] p-4 text-center bg-muted rounded-lg"
	>
		<h2 class="mb-2 text-2xl font-bold">No search results found.</h2>
		<p class="max-w-sm mt-4 mb-20 text-muted-foreground">
			No videos matched your search criteria. Try refining your search or check out your collection.
		</p>
	</div>
{:else}
	<div
		class="flex flex-col items-center justify-center min-h-[400px] p-4 text-center bg-muted rounded-lg"
	>
		<h2 class="mb-2 text-2xl font-bold">No videos available yet.</h2>
		<p class="max-w-sm mt-4 mb-20 text-muted-foreground">
			You haven't added any videos to your collection yet. Start adding videos to get started!
		</p>
	</div>
{/if}
