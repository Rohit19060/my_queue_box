<script>
	import { CurrentPage, setSpaPage } from '$lib';
	import { totalVideoCountFn } from '$lib/stores/SpaStore';
	import { onMount } from 'svelte';
	import BookmarkCard from './home/BookmarkCard.svelte';
	import Button from './home/Button.svelte';
	import CountAnalytics from './home/CountAnalytics.svelte';
	import VideoCard from './home/VideoCard.svelte';

	let totalVideoCount = 0;

	onMount(async () => {
		totalVideoCount = await totalVideoCountFn();
	});
</script>

<div class="flex flex-col min-h-[100dvh]">
	<main class="grid flex-1 grid-cols-1 gap-6 p-4 md:grid-cols-2 md:p-6">
		<div class="col-span-1 p-4 rounded-lg shadow-sm bg-background md:p-6 md:col-span-2">
			<div class="grid gap-10 sm:grid-cols-2">
				<CountAnalytics
					totalCount={totalVideoCount}
					pendingCount={124}
					label="Bookmarks"
					undoneLabel="Unopened Bookmarks"
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
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
					<VideoCard
						title="Tailwind CSS Crash Course"
						description="Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces."
						timeAgo="1 day ago"
					></VideoCard>
					<VideoCard
						title="Tailwind CSS Crash Course"
						description="Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces."
						timeAgo="1 day ago"
					></VideoCard>
				</div>
			</div>
		</div>
	</main>
</div>
