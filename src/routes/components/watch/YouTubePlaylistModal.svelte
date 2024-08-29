<script>
	import {
		addVideoToIndexDB,
		error,
		isPlayListModalOpen,
		playlistVideos
	} from '$lib/stores/videoDB';
	import Button from '../home/Button.svelte';
	import VideoDetails from './video_details.svelte';

	export let onAdd = () => console.log('Add button clicked');
	
	let isLoading = false;
	
	function closeModal() {
		isPlayListModalOpen.set(false);
	}
	
	async function addAllVideos() {
		if (!playlistVideos) {
			return;
		}
		try {
			isLoading = true;
			for (let i = 0; i < $playlistVideos.length; i++) {
				var video = $playlistVideos[i];
				const response = await fetch(`/api/youtube?video=${encodeURIComponent(video.id)}`);
				const data = await response.json();
				if (!response.ok) {
					throw new Error(data.error);
				}
				await addVideoToIndexDB(data);
			}
			onAdd();
			playlistVideos.set([]);
			closeModal();
		} catch (e) {
			console.error('Error adding video to indexDB', e);
			error.set(`Couldn't add video to indexDB ${e}`);
			return;
		} finally {
			isLoading = false;
		}
	}
</script>

{#if $isPlayListModalOpen}
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
					<h2 class="text-xl font-bold">Playlist Videos ({$playlistVideos.length})</h2>
					<div class="flex items-center justify-center w-24">
						{#if isLoading}
							<div class="loader" />
						{:else}
							<Button label="Add All" onclick={addAllVideos} />{/if}
					</div>
				</div>
				{#each $playlistVideos as video}
					<VideoDetails videoDetails={video} />
				{/each}
			</div>
		</div>
	</div>
{/if}
