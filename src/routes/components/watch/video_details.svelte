<script lang="ts">
	import { addVideoToIndexDB, error } from '$lib/stores/videoDB';
	import Button from '../home/Button.svelte';

	export let onAdd = () => console.log('Add button clicked');
	export let videoDetails: YouTubeVideo | null;

	async function addToIndexDB() {
		if (!videoDetails) {
			return;
		}
		let tempVideo = videoDetails;
		if (!videoDetails.duration) {
			const response = await fetch(`/api/youtube?video=${encodeURIComponent(videoDetails.id)}`);
			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.error);
			}
			tempVideo = data;
		}
		try {
			await addVideoToIndexDB(videoDetails);
			onAdd();
		} catch (e) {
			console.error('Error adding video to indexDB', e);
			error.set(`Couldn't add video to indexDB ${e}`);
			return;
		} finally {
			error.set(null);
		}
	}
</script>

<div>
	{#if $error}
		<p class="mt-4 text-center text-red-500">Error: {$error}</p>
	{:else if videoDetails}
		<div class="flex items-center justify-between gap-4 my-4">
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
</div>
