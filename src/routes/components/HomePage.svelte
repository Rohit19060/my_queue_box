<script lang="ts">
	import { CurrentPage, setSpaPage } from '$lib';
	import { totalAndWatchedVideoCountFn } from '$lib/stores/MainStore';
	import { IS_ADD_MODAL, topReads, totalReadCount } from '$lib/stores/ReadDB';
	import { topVideos } from '$lib/stores/VideoDB';
	import { onMount } from 'svelte';
	import Button from './Common/Button.svelte';
	import BookmarkCard from './home/BookmarkCard.svelte';
	import CountAnalytics from './home/CountAnalytics.svelte';
	import Video from './watch/Video.svelte';

	let totalVideoCount = 0;
	let watchedVideoCount = 0;
	let totalReads = 0;
	let videos: App.VideoIndexDB[] = [];
	let reads: App.ReadIndexDB[] = [];

	onMount(async () => {
		let res = await totalAndWatchedVideoCountFn();
		totalVideoCount = res.totalVideoCount;
		watchedVideoCount = res.watchedCount;
		let res2 = await totalReadCount();
		totalReads = res2.total;
		videos = await topVideos();
		reads = await topReads();
	});

	function toggleWatch(video: App.VideoIndexDB) {
		videos = videos.map((y) => (y.id === video.id ? { ...video, watched: !video.watched } : y));
	}
</script>

<svelte:head>
	<title>Home | Queue Box</title>
</svelte:head>
<main class="grid flex-1 grid-cols-1 gap-6 p-4 md:grid-cols-2 md:p-6">
	<div class="col-span-1 p-4 rounded-lg shadow-sm bg-background md:p-6 md:col-span-2">
		<div class="grid gap-10 sm:grid-cols-2">
			<CountAnalytics
				totalCount={totalVideoCount}
				pendingCount={watchedVideoCount}
				label="Videos"
				undoneLabel="watched"
				onclick={() => setSpaPage(CurrentPage.Watch)}
			/>
			<CountAnalytics
				totalCount={totalReads}
				pendingCount={totalReads}
				label="Read"
				undoneLabel="read"
				onclick={() => setSpaPage(CurrentPage.Read)}
			/>
		</div>
	</div>
	{#if reads.length > 0}
		<div class="col-span-1 p-4 rounded-lg shadow-sm bg-background md:p-6 md:col-span-2">
			<div class="flex flex-col gap-4">
				<div class="flex items-center justify-between">
					<h3 class="text-lg font-semibold">Read</h3>
					<Button onclick={() => setSpaPage(CurrentPage.Read)}></Button>
				</div>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
					{#each reads as read}
						<BookmarkCard {read} />
					{/each}
				</div>
			</div>
		</div>
	{:else}
		<div class="col-span-1 p-4 rounded-lg bg-background md:p-6 md:col-span-2">
			<div class="flex flex-col gap-4">
				<div class="flex items-center justify-center gap-4">
					<h3 class="text-lg font-semibold">Start by adding some Reads</h3>
					<Button
						onclick={() => {
							setSpaPage(CurrentPage.Read);
							IS_ADD_MODAL.set(true);
						}}
						label="Add Reads"
					></Button>
				</div>
			</div>
		</div>
	{/if}
	{#if videos.length > 0}
		<div class="col-span-1 p-4 rounded-lg shadow-sm bg-background md:p-6 md:col-span-2">
			<div class="flex flex-col gap-4">
				<div class="flex items-center justify-between">
					<h3 class="text-lg font-semibold">Videos</h3>
					<Button onclick={() => setSpaPage(CurrentPage.Watch)}></Button>
				</div>
				<div
					class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
				>
					{#each videos as video}
						<Video {video} afterToggleWatch={(x) => toggleWatch(x)} />
					{/each}
				</div>
			</div>
		</div>
	{:else}
		<div class="col-span-1 p-4 rounded-lg bg-background md:p-6 md:col-span-2">
			<div class="flex flex-col gap-4">
				<div class="flex items-center justify-center gap-4">
					<h3 class="text-lg font-semibold">Start by adding some Videos</h3>
					<Button onclick={() => setSpaPage(CurrentPage.Watch)} label="Add Videos"></Button>
				</div>
			</div>
		</div>
	{/if}
</main>
