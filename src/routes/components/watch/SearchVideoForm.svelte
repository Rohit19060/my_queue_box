<script lang="ts">
	import { extractYouTubeId, searchYouTubeAPI } from '$lib';
	import {
		IS_PLAYLIST_MODAL_TYPE,
		SEARCHED_VIDEO_DETAILS,
		PLAYLIST_VIDEO_LIST
	} from '$lib/stores/VideoDB';
	import Button from '../Common/Button.svelte';
	import YouTubePlaylistModal from './YouTubePlaylistModal.svelte';

	let isLoading = false;

	async function searchYouTube() {
		const searchText = document.querySelector('#youTubeVideo') as HTMLInputElement;
		if (!searchText.value) {
			alert('Please enter a search term.');
			return;
		}
		SEARCHED_VIDEO_DETAILS.set(null);
		PLAYLIST_VIDEO_LIST.set([]);
		let extractedData = extractYouTubeId(searchText.value);
		IS_PLAYLIST_MODAL_TYPE.set(extractedData.type);
		try {
			isLoading = true;
			await searchYouTubeAPI(searchText.value);
			searchText.value = '';
		} catch (err: any) {
			SEARCHED_VIDEO_DETAILS.set(null);
		} finally {
			isLoading = false;
		}
	}
	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			searchYouTube();
		}
	}
</script>

<div class="flex items-center justify-center gap-2 mt-2 mb-3">
	<input
		class="w-full p-2 border border-gray-300 max-w-80 focus:outline-none focus:border-black focus:border-opacity-75"
		placeholder="Enter a YouTube URL or ID"
		type="text"
		id="youTubeVideo"
		on:keydown={handleKeyDown}
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
