<script lang="ts">
	import {
		addVideoToIndexDB,
		IS_PLAYLIST_MODAL_OPEN,
		isAlreadyThere,
		PLAYLIST_VIDEO_LIST,
		VIDEO_STORE
	} from '$lib/stores/VideoDB';
	import { onMount } from 'svelte';
	import Button from '../Common/Button.svelte';

	export let videoDetails: App.YouTubeVideo | null;

	let isLoading = false;
	let isAlreadyAdded = false;

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
			removeVideoFromPlaylist();
		} catch (e) {
			console.error('Error adding video to indexDB', e);
			return;
		} finally {
			isLoading = false;
		}
	}

	function removeVideoFromPlaylist() {
		if (!videoDetails) return;
		$PLAYLIST_VIDEO_LIST = $PLAYLIST_VIDEO_LIST.filter((x) => x.id !== videoDetails?.id);
		videoDetails = null;
		if ($PLAYLIST_VIDEO_LIST.length === 0) {
			IS_PLAYLIST_MODAL_OPEN.set(false);
		}
	}

	$: checkIfAlreadyAdded();

	async function checkIfAlreadyAdded() {
		if (videoDetails && videoDetails.id) {
			isAlreadyAdded = await isAlreadyThere(videoDetails.id);
		} else {
			isAlreadyAdded = false;
		}
	}

	onMount(async () => {
		if (videoDetails && videoDetails.id) {
			isAlreadyAdded = await isAlreadyThere(videoDetails.id);
		}
	});
</script>

{#if videoDetails}
	<div class="flex flex-col items-center justify-center gap-4 my-6 md:flex-row">
		<img
			src="https://i.ytimg.com/vi/{videoDetails.id}/hqdefault.jpg"
			alt={videoDetails.title}
			width="220"
			class="object-cover rounded-md"
			style="aspect-ratio: 1280 / 720; object-fit: cover;"
		/>
		<h2 class="text-lg font-bold capitalize line-clamp-2 max-w-96 min-w-96">
			{videoDetails.title}
		</h2>
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
				onclick={() => window.open(`https://www.youtube.com/watch?v=${videoDetails?.id}`, '_blank')}
				className="md:mr-4 mx-4"
			/>
			<Button label="Remove" onclick={removeVideoFromPlaylist} />
		</div>
	</div>
{/if}
