<script lang="ts">
	import {
		addVideoToIndexDB,
		API_ERROR,
		IS_PLAYLIST_MODAL_OPEN,
		PLAYLIST_VIDEO_LIST,
		VIDEO_STORE
	} from '$lib/stores/VideoDB';
	import Button from '../home/Button.svelte';
	import VideoDetails from './SearchedVideoDetails.svelte';

	let isLoading = false;

	function closeModal() {
		IS_PLAYLIST_MODAL_OPEN.set(false);
	}

	async function addAllVideos() {
		if (!PLAYLIST_VIDEO_LIST) {
			return;
		}
		try {
			isLoading = true;
			let videos: App.VideoIndexDB[] = [];
			for (let i = 0; i < $PLAYLIST_VIDEO_LIST.length; i++) {
				let x = await addVideoToIndexDB($PLAYLIST_VIDEO_LIST[i]);
				if (x) {
					videos.push(x);
				}
			}
			PLAYLIST_VIDEO_LIST.set([]);
			VIDEO_STORE.update((x) => [...x, ...videos]);
			closeModal();
		} catch (e) {
			console.error('Error adding video to indexDB', e);
			API_ERROR.set(`Couldn't add video to indexDB ${e}`);
			return;
		} finally {
			isLoading = false;
		}
	}
</script>

{#if $IS_PLAYLIST_MODAL_OPEN}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
		<div class="relative w-full max-w-5xl max-h-screen overflow-hidden bg-white rounded-xl">
			<button
				on:click={closeModal}
				class="absolute p-1 text-white bg-orange-100 rounded-full top-4 right-6 hover:bg-orange-400"
			>
				✖
			</button>
			<div class="p-6 max-h-[80vh] overflow-y-auto flex flex-col items-center justify-start">
				<div class="flex items-center justify-between mb-4 min-w-96">
					<div></div>
					<h2 class="text-xl font-bold">Playlist Videos ({$PLAYLIST_VIDEO_LIST.length})</h2>
					<div class="flex items-center justify-center w-24">
						{#if isLoading}
							<div class="loader" />
						{:else}
							<Button label="Add All" onclick={addAllVideos} />{/if}
					</div>
				</div>
				{#each $PLAYLIST_VIDEO_LIST as video}
					<VideoDetails videoDetails={video} />
				{/each}
			</div>
		</div>
	</div>
{/if}
