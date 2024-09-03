<script lang="ts">
	import { CurrentPage, setSpaPage } from '$lib';
	import { totalAndWatchedVideoCountFn } from '$lib/stores/SpaStore';
	import { topVideos } from '$lib/stores/VideoDB';
	import { onMount } from 'svelte';
	import BookmarkCard from './home/BookmarkCard.svelte';
	import Button from './home/Button.svelte';
	import CountAnalytics from './home/CountAnalytics.svelte';
	import Video from './watch/Video.svelte';

	let totalVideoCount = 0;
	let watchedVideoCount = 0;
	let videos: App.VideoIndexDB[] = [];

	onMount(async () => {
		let res = await totalAndWatchedVideoCountFn();
		totalVideoCount = res.total;
		watchedVideoCount = res.watched;
		videos = await topVideos();
	});

	function toggleWatch(video: App.VideoIndexDB) {
		videos = videos.map((y) => (y.id === video.id ? { ...video, watched: !video.watched } : y));
	}
</script>

<div class="flex flex-col min-h-[100dvh]">
	<main class="grid flex-1 grid-cols-1 gap-6 p-4 md:grid-cols-2 md:p-6">
		<div class="col-span-1 p-4 rounded-lg shadow-sm bg-background md:p-6 md:col-span-2">
			<div class="grid gap-10 sm:grid-cols-2">
				<CountAnalytics
					totalCount={totalVideoCount}
					pendingCount={watchedVideoCount}
					label="Videos"
					undoneLabel="Unopened Videos"
				/>
				<CountAnalytics
					totalCount={456}
					pendingCount={124}
					label="Videos"
					undoneLabel="Unwatched Videos"
				/>
			</div>
		</div>
		<div class="col-span-1 p-4 rounded-lg shadow-sm bg-background md:p-6 md:col-span-2">
			<div class="flex flex-col gap-4">
				<div class="flex items-center justify-between">
					<h3 class="text-lg font-semibold">Bookmarks</h3>
					<Button onclick={() => setSpaPage(CurrentPage.Watch)}></Button>
				</div>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
					<BookmarkCard
						title="Tailwind CSS Documentation"
						description="Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces."
						timeAgo="1 day ago"
					></BookmarkCard>
					<BookmarkCard
						title="React Hooks Documentation"
						description="React Hooks are a set of functions that allow you to use state and other React features without writing a class component."
						timeAgo="3 days ago"
					></BookmarkCard>
					<BookmarkCard
						title="Next.js Documentation"
						description="Next.js is a React framework that enables server-side rendering and other advanced features for building production-ready React applications."
						timeAgo="1 week ago"
					></BookmarkCard>
				</div>
			</div>
		</div>
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
	</main>
</div>
