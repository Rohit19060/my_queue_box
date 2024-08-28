<script lang="ts">
	import { urlToYouTubeId } from '$lib';
	import { error, videoDetails } from '$lib/stores/videoDB';
	import Button from '../home/Button.svelte';

	let isLoading = false;

	async function searchYouTube() {
		const searchText = document.querySelector('input') as HTMLInputElement;
		if (!searchText.value) {
			alert('Please enter a search term.');
			return;
		}
		let videoId = searchText.value;
		videoId = urlToYouTubeId(videoId);
		try {
			isLoading = true;
			const response = await fetch(`/api/youtube?video=${encodeURIComponent(videoId)}`);
			const data = await response.json();
			console.log(data);
			if (!response.ok) {
				throw new Error(data.error);
			}
			videoDetails.set(data);
			error.set(null);
			searchText.value = '';
		} catch (err: any) {
			videoDetails.set(null);
			error.set(err.message);
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="flex items-center justify-center gap-2 px-4">
	<input
		class="w-full h-10 px-3 py-2 mr-2 text-sm border rounded-md border-input bg-background ring-offset-backgroundplaceholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ring-orange-400"
		placeholder="Enter a YouTube URL or video ID"
		type="text"
	/>
	<div class="flex items-center justify-center w-24">
		{#if isLoading}
			<div class="loader" />
		{:else}
			<Button onclick={searchYouTube} label="Search" />
		{/if}
	</div>
</div>
