<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import {
		currentCursorValue,
		dataStore,
		fetchPaginatedData,
		hasMore,
		isLoading
	} from '../stores/videoDB';
	import UploadJson from './watch/UploadJson.svelte';
	import VideoTable from './watch/VideoTable.svelte';

	let observer: IntersectionObserver;
	let sortOptions = ['titleIndex', 'durationIndex', 'channelIndex', 'publishedAtIndex'];
	let sortBy = sortOptions[0];
	let isDesc = false;
	let dataLoaded = true;
	let searchText = '';

	async function loadMoreItems() {
		if (get(isLoading) || !get(hasMore)) return;
		$isLoading = true;
		try {
			const cursorValue = get(currentCursorValue);
			const { data: newItems, nextCursorValue } = await fetchPaginatedData(
				cursorValue,
				sortBy,
				isDesc
			);
			if (newItems.length === 0 || nextCursorValue === null) {
				hasMore.set(false); // No more items to load
			}
			dataStore.update((items) => [...items, ...newItems]);
			currentCursorValue.set(nextCursorValue);
		} catch (error) {
			console.error('Failed to load more items:', error);
		} finally {
			$isLoading = false;
			dataLoaded = false;
		}
	}

	function setupObserver() {
		if (observer) observer.disconnect();
		observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					loadMoreItems();
				}
			},
			{ rootMargin: '100px' }
		);

		const target = document.querySelector('#load-more-trigger');
		if (target) observer.observe(target);
	}

	onMount(() => {
		loadMoreItems(); // Initial load
		setupObserver();

		// Set up event listener for data changes
		const dataChangeListener = () => {
			reset(sortBy);
			loadMoreItems();
		};

		window.addEventListener('data-changed', dataChangeListener);

		// Clean up event listener on component unmount
		return () => {
			if (observer) observer.disconnect();
			window.removeEventListener('data-changed', dataChangeListener);
		};
	});

	function reset(sortText: string) {
		if (sortText == sortBy) {
			isDesc = !isDesc;
		} else {
			sortBy = sortText;
			isDesc = false;
		}
		dataStore.update(() => []);
		currentCursorValue.set(null);
		hasMore.set(true);
	}
</script>

<div class="flex justify-between my-4">
	<div class="flex-1"></div>
	<h1 class="flex-1 text-2xl grow">Watch Later</h1>
	<div class="mr-3"><UploadJson /></div>
</div>
<div>
	{#if dataLoaded}
		<div class="loader"></div>
	{:else}
		<VideoTable
			data={$dataStore}
			onclick={(str: string) => reset(str)}
			onSearch={(str: string) => (searchText = str)}
		/>
	{/if}
</div>
<div id="load-more-trigger"></div>
