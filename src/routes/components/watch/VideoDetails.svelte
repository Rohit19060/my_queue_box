<script lang="ts">
	import {
		addVideoToIndexDB,
		CURRENT_VIDEO_ID,
		IS_PLAY_VIDEOS,
		IS_PLAYLIST_MODAL_OPEN,
		IS_VIDEO_MODAL_OPEN,
		isAlreadyThere,
		PLAYLIST_VIDEO_LIST,
		setVideoAsWatched,
		VIDEO_STORE
	} from '$lib/stores/VideoDB';
	import { onMount } from 'svelte';
	import Button from '../Common/Button.svelte';

	export let videoDetails: App.YouTubeVideo | null;

	let isLoading = false;
	let isAlreadyAdded = false;

	// Add video to IndexedDB and handle state updates
	async function addToIndexDB() {
		if (!videoDetails) {
			return;
		}
		isLoading = true;
		try {
			let video = await addVideoToIndexDB(videoDetails);
			if (video) {
				VIDEO_STORE.update((x) => [video, ...x]);
			}
			removeVideoFromPlaylist(); // Remove video from the playlist
		} catch (e) {
			console.error('Error adding video to indexDB', e);
			return;
		} finally {
			isLoading = false;
		}
	}

	// Remove video from the playlist and update `videoDetails` safely
	function removeVideoFromPlaylist() {
		if (!videoDetails) return;

		const updatedPlaylist = $PLAYLIST_VIDEO_LIST.filter((x) => x.id !== videoDetails?.id);
		$PLAYLIST_VIDEO_LIST = updatedPlaylist;

		// If there are more videos, set the next videoDetails only if it isn't already added
		const nextVideo = updatedPlaylist.find(async (x) => !(await isAlreadyThere(x.id)));
		videoDetails = nextVideo || null;

		if (updatedPlaylist.length === 0) {
			IS_PLAYLIST_MODAL_OPEN.set(false);
		}
	}

	// Check if the video is already added
	async function checkIfAlreadyAdded() {
		if (videoDetails && videoDetails.id) {
			isAlreadyAdded = await isAlreadyThere(videoDetails.id);
		} else {
			isAlreadyAdded = false;
		}
	}

	// Ensure state is correct when the component mounts
	onMount(async () => {
		if (videoDetails && videoDetails.id) {
			isAlreadyAdded = await isAlreadyThere(videoDetails.id);
		} else {
			isAlreadyAdded = false;
		}
	});

	// Open the modal to watch the video
	async function openModal() {
		try {
			if (videoDetails !== null) {
				await setVideoAsWatched(videoDetails?.id, true);
			}
		} catch (e) {
			console.error('Error setting video as watched', e);
		}
		if (videoDetails !== null) {
			IS_PLAY_VIDEOS.set(false);
			CURRENT_VIDEO_ID.set(videoDetails?.id);
			IS_VIDEO_MODAL_OPEN.set(true);
		}
	}

	// Reactively check if the video is already added whenever `videoDetails` changes
	$: checkIfAlreadyAdded();
</script>

<!-- UI -->
{#if videoDetails}
	<div class="flex flex-col items-center justify-center gap-4 my-6 md:flex-row">
		<img
			src="https://i.ytimg.com/vi/{videoDetails.id}/hqdefault.jpg"
			alt={videoDetails.title}
			width="220"
			class="object-cover rounded-md"
			style="aspect-ratio: 1280 / 720; object-fit: cover;"
		/>
		<div class="flex flex-col">
			<h2 class="text-lg font-bold capitalize line-clamp-2 max-w-96 min-w-96">
				{videoDetails.title}<br>
			</h2>
			<span class="text-md">{videoDetails.channelTitle}</span>
		</div>
		<div class="flex">
			<div class="flex items-center justify-center md:w-24">
				{#if !isAlreadyAdded}
					{#if isLoading}
						<div class="loader"></div>
					{:else}
						<Button label="Add" onclick={addToIndexDB} />
					{/if}
				{/if}
			</div>
			<Button
				label="Watch"
				onclick={openModal}
				className="md:mr-4 mx-4"
			/>
			<Button label="Remove" onclick={removeVideoFromPlaylist} />
		</div>
	</div>
{/if}