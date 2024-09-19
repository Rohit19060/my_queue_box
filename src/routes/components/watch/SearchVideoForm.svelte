<script lang="ts">
	import { extractYouTubeId, YouTubeIdType } from '$lib';
	import {
		API_ERROR,
		IS_PLAYLIST_MODAL_OPEN,
		IS_PLAYLIST_MODAL_TYPE,
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
		IS_PLAYLIST_MODAL_TYPE.set(extractedData.type);
		try {
			isLoading = true;
			if (extractedData.type === YouTubeIdType.Video) {
				const response = await fetch(`/api/youtube?video=${encodeURIComponent(extractedData.id)}`);
				const data = await response.json();
				if (!response.ok) {
					throw new Error(data.error);
				}
				SEARCHED_VIDEO_DETAILS.set(data as App.YouTubeVideo);
			} else if (extractedData.type === YouTubeIdType.Playlist) {
				const response = await fetch(
					`/api/youtube?playlist=${encodeURIComponent(extractedData.id)}`
				);
				const data = await response.json();
				if (!response.ok) {
					throw new Error(data.error);
				}
				PLAYLIST_VIDEO_LIST.set(data as App.YouTubeVideo[]);
				IS_PLAYLIST_MODAL_OPEN.set(true);
			} else if (extractedData.type === YouTubeIdType.Search) {
				const response = await fetch(`/api/youtube?search=${encodeURIComponent(extractedData.id)}`);
				const data = await response.json();
				if (!response.ok) {
					throw new Error(data.error);
				}
				PLAYLIST_VIDEO_LIST.set(data as App.YouTubeVideo[]);
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
	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			searchYouTube();
		}
	}
</script>

<div class="flex items-center justify-center gap-2 mx-4">
	<input
		class="w-full p-2 border border-gray-300 focus:outline-none focus:border-black focus:border-opacity-75"
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
