<script lang="ts">
	import { urlToPlayListId } from '$lib';
	import { error, isPlayListModalOpen, playlistVideos } from '$lib/stores/videoDB';
	import Button from '../home/Button.svelte';
	import YouTubePlaylist from './YouTubePlaylistModal.svelte';

	export let onAdd = () => console.log('Add button clicked');

	let isLoading = false;

	async function searchPlayList() {
		const searchText = document.querySelector('#youTubePlaylist') as HTMLInputElement;
		if (!searchText.value) {
			alert('Please enter a search term.');
			return;
		}
		let videoId = searchText.value;
		videoId = urlToPlayListId(videoId);
		try {
			isLoading = true;
			const response = await fetch(`/api/youtube?playlist=${encodeURIComponent(videoId)}`);
			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.error);
			}
			console.log(data);
			playlistVideos.set(data);
			console.log($playlistVideos);
			isPlayListModalOpen.set(true);
			error.set(null);
			searchText.value = '';
		} catch (err: any) {
			playlistVideos.set([]);
			error.set(err.message);
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="flex items-center justify-center gap-4 mx-4">
	<input
		class="w-full h-10 px-3 py-2 mr-2 text-sm border rounded-md border-input bg-background ring-offset-backgroundplaceholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ring-orange-400"
		placeholder="Enter a YouTube URL or video ID"
		type="text"
		id="youTubePlaylist"
	/>
	<div class="flex items-center justify-center w-24">
		{#if isLoading}
			<div class="loader" />
		{:else}
			<Button onclick={searchPlayList} label="Search&nbsp;Playlist" />
		{/if}
	</div>
</div>
<YouTubePlaylist {onAdd} />
