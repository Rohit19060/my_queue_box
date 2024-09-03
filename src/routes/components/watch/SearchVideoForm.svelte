<script lang="ts">
	import { extractYouTubeId, YouTubeIdType } from '$lib';
	import {
		API_ERROR,
		IS_PLAYLIST_MODAL_OPEN,
		PLAYLIST_VIDEO_LIST,
		SEARCHED_VIDEO_DETAILS
	} from '$lib/stores/VideoDB';
	import Button from '../home/Button.svelte';
	import YouTubePlaylistModal from './YouTubePlaylistModal.svelte';

	let isLoading = false;

	async function searchYouTube() {
		const searchText = document.querySelector('#youTubeVideo') as HTMLInputElement;
		if (!searchText.value) {
			alert('Please enter a search term.');
			return;
		}
		let extractedData = extractYouTubeId(searchText.value);
		try {
			isLoading = true;
			if (extractedData.type === YouTubeIdType.Video) {
				const response = await fetch(`/api/youtube?video=${encodeURIComponent(extractedData.id)}`);
				const data = await response.json();
				if (!response.ok) {
					throw new Error(data.error);
				}
				SEARCHED_VIDEO_DETAILS.set(data);
			} else if (extractedData.type === YouTubeIdType.Playlist) {
				const response = await fetch(
					`/api/youtube?playlist=${encodeURIComponent(extractedData.id)}`
				);
				const data = await response.json();
				if (!response.ok) {
					throw new Error(data.error);
				}
				PLAYLIST_VIDEO_LIST.set(data);
				IS_PLAYLIST_MODAL_OPEN.set(true);
			}
			searchText.value = '';
		} catch (err: any) {
			SEARCHED_VIDEO_DETAILS.set(null);
			API_ERROR.set(err.message);
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="flex items-center justify-center gap-2 mx-4">
	<input
		class="w-full h-10 px-3 py-2 mr-2 text-sm border rounded-md border-input bg-background ring-offset-backgroundplaceholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ring-orange-400"
		placeholder="Enter a YouTube URL or ID"
		type="text"
		id="youTubeVideo"
	/>
	<div class="flex items-center justify-center w-24">
		{#if isLoading}
			<div class="loader" />
		{:else}
			<Button onclick={searchYouTube} label="Search" />
		{/if}
	</div>
</div>
<YouTubePlaylistModal />
