<script lang="ts">
	import { addVideoToIndexDB, API_ERROR, VIDEO_STORE } from '$lib/stores/VideoDB';
	import Button from '../home/Button.svelte';

	export let videoDetails: App.YouTubeVideo | null;

	async function addToIndexDB() {
		if (!videoDetails) {
			return;
		}
		try {
			let video = await addVideoToIndexDB(videoDetails);
			if (video) {
				VIDEO_STORE.update((x) => [...x, video]);
			}
			videoDetails = null;
		} catch (e) {
			console.error('Error adding video to indexDB', e);
			API_ERROR.set(`Couldn't add video to indexDB ${e}`);
			return;
		}
	}
</script>

{#if videoDetails}
	<div class="flex items-center justify-center gap-4 my-6">
		<img
			src="https://i.ytimg.com/vi/{videoDetails.id}/mqdefault.jpg"
			alt={videoDetails.title}
			width="220"
			class="object-cover rounded-md"
			style="aspect-ratio: 1280 / 720; object-fit: cover;"
		/>
		<h2 class="text-lg font-bold capitalize line-clamp-2 max-w-96 min-w-96">
			{videoDetails.title}
		</h2>
		<Button label="Add" onclick={addToIndexDB} />
		<Button
			label="Watch"
			onclick={() => window.open(`https://www.youtube.com/watch?v=${videoDetails?.id}`, '_blank')}
		/>
		<Button label="Remove" onclick={() => (videoDetails = null)} />
	</div>
{/if}
