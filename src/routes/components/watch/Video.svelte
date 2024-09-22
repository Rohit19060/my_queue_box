<script lang="ts">
	import { secondsToHumanReadable, timeAgo } from '$lib';
	import {
		CURRENT_VIDEO_ID,
		IS_VIDEO_MODAL_OPEN,
		removeVideoFromIndexDB,
		setVideoAsWatched,
		VIDEO_STORE
	} from '$lib/stores/VideoDB';
	import TrashIcon from '../Svgs/TrashIcon.svelte';
	import UnWatched from '../Svgs/UnWatched.svelte';
	import Watched from '../Svgs/Watched.svelte';

	export let video: App.VideoIndexDB;
	export let afterToggleWatch: (video: App.VideoIndexDB) => void = () => {};

	async function removeVideo(id: string) {
		try {
			let areYouSure = confirm('Are you sure you want to remove this video from your collection?');
			if (areYouSure) {
				await removeVideoFromIndexDB(id);
				VIDEO_STORE.update((x) => x.filter((x) => x.id !== id));
			}
		} catch (e) {
			console.error('Error removing video from indexDB', e);
			return;
		}
	}

	async function openModal() {
		try {
			await setVideoAsWatched(video.id, true);
			VIDEO_STORE.update((x) =>
				x.map((y) => (y.id === video.id ? { ...video, watched: true } : y))
			);
		} catch (e) {
			console.error('Error setting video as watched', e);
		}
		CURRENT_VIDEO_ID.set(video);
		IS_VIDEO_MODAL_OPEN.set(true);
	}

	async function toggleWatch(event: MouseEvent) {
		event.stopPropagation(); // Prevents the parent button click event
		try {
			await setVideoAsWatched(video.id, !video.watched);
			VIDEO_STORE.update((x) =>
				x.map((y) => (y.id === video.id ? { ...video, watched: !video.watched } : y))
			);
			afterToggleWatch(video);
		} catch (e) {
			console.error('Error setting video as watched', e);
		}
	}
</script>

<div class="flex flex-col justify-between bg-background rounded-xl group">
	<button on:click={openModal}>
		<div class="relative">
			<img
				src="https://i.ytimg.com/vi/{video.id}/maxresdefault.jpg"
				alt={video.title}
				class="relative flex-grow object-cover w-full transition-opacity rounded-xl aspect-video group-hover:opacity-80"
			/>
			<div class="absolute px-2 py-1 text-sm text-white rounded-md bottom-2 left-2 bg-black/50">
				{timeAgo(video.publishedAt)}
			</div>
			{#if video.watched}
				<button
					class="absolute p-1.5 py-1 text-sm text-white rounded-md top-2 right-2 bg-black/60"
					on:click={toggleWatch}
				>
					<Watched />
				</button>
			{:else}
				<button
					class="absolute p-1.5 py-1 text-sm text-white rounded-md top-2 right-2 bg-black/60 opacity-0 group-hover:opacity-100"
					on:click={toggleWatch}
				>
					<UnWatched />
				</button>
			{/if}
			<div class="absolute px-2 py-1 text-sm text-white rounded-md bottom-2 right-2 bg-black/50">
				{secondsToHumanReadable(video.durationSec)}
			</div>
		</div>
	</button>
	<div class="flex flex-col mt-3">
		<a href="https://www.youtube.com/watch?v={video.id}" target="_blank" rel="noopener noreferrer">
			<h3 class="font-medium capitalize line-clamp-2 min-h-12">{video.title}</h3>
		</a>
		<div class="flex items-center justify-between mt-2">
			<a
				href={`https://www.youtube.com/channel/${video.channelId}`}
				rel="noopener noreferrer"
				target="_blank"
				class="capitalize"
			>
				{video.channelTitle}</a
			>
			<button on:click={() => removeVideo(video.id)}><TrashIcon /></button>
		</div>
	</div>
</div>
