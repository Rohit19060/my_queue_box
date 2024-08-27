<script>
	import { addVideoToIndexDB, error, videoDetails } from '$lib/stores/videoDB';
	import Button from '../home/Button.svelte';

	function addToIndexDB() {
		if (!$videoDetails) {
			return;
		}
		try {
			addVideoToIndexDB($videoDetails);
		} catch (e) {
			console.error("Error adding video to indexDB", e);
			return;
		} finally {
			error.set(null);
		}
		videoDetails.set(null);
	}
</script>

<div>
	{#if $error}
		<p class="mt-4 text-center text-red-500">Error: {$error}</p>
	{:else if $videoDetails}
		<div class="flex items-center justify-center gap-4 mt-4">
			<img
				src="https://i.ytimg.com/vi/{$videoDetails.id}/mqdefault.jpg"
				alt={$videoDetails.title}
				width="220"
				class="object-cover rounded-md"
				style="aspect-ratio: 1280 / 720; object-fit: cover;"
			/>
			<h2 class="text-lg font-bold capitalize">{$videoDetails.title}</h2>
			<Button label="Add" onclick={addToIndexDB} />
			<Button
				label="Watch"
				onclick={() => window.open(`https://www.youtube.com/watch?v=${$videoDetails.id}`, '_blank')}
			/>
			<Button label="Remove" onclick={() => videoDetails.set(null)} />
		</div>
	{/if}
</div>
