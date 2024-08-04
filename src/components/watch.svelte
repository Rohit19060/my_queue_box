<script lang="ts">
	import { dateToHumanReadable, secondsToHumanReadable } from '$lib';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import {
		currentCursorValue,
		dataStore,
		fetchPaginatedData,
		hasMore,
		isLoading,
		ITEMS_PER_PAGE,
		totalCount
	} from '../stores/dataStore';
	import UploadJson from './upload_json.svelte';

	let observer: IntersectionObserver;
	let sortOptions = ['titleIndex', 'durationIndex', 'channelIndex', 'publishedAtIndex'];
	let sortBy = sortOptions[0];

	let dataLoaded = true;

	async function loadMoreItems() {
		if (get(isLoading) || !get(hasMore)) return;
		$isLoading = true;
		try {
			const cursorValue = get(currentCursorValue);
			const { data: newItems, nextCursorValue } = await fetchPaginatedData(cursorValue, sortBy);
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
			reset();
			loadMoreItems();
		};

		window.addEventListener('data-changed', dataChangeListener);

		// Clean up event listener on component unmount
		return () => {
			if (observer) observer.disconnect();
			window.removeEventListener('data-changed', dataChangeListener);
		};
	});

	function reset() {
		dataStore.update(() => []);
		currentCursorValue.set(null);
		hasMore.set(true);
	}
</script>

<div class="text-center">
	<h1 class="text-3xl">Watch Later</h1>
</div>
<div>
	<UploadJson />

	{#if dataLoaded}
		<div class="loader"></div>
	{:else}
		<!-- Total -->
		<div class="flex items-center justify-center gap-4 px-4 py-10 font-bold rounded-2xl">
			<h4>Total</h4>
			<span>{$dataStore.length}/{$totalCount}</span>
			<span>{ITEMS_PER_PAGE} items per page</span>
		</div>
		<select class="select-none" on:change={() => reset()} bind:value={sortBy}>
			<option value="titleIndex">Title</option>
			<option value="durationIndex">Duration</option>
			<option value="channelIndex">Channel</option>
			<option value="publishedAtIndex">Published At</option>
		</select>
		<table class="w-full table-auto">
			<thead>
				<tr>
					<th>No.</th>
					<th>Title</th>
					<th>Duration</th>
					<th>Channel</th>
					<th>Published At</th>
				</tr>
			</thead>
			<tbody>
				{#each $dataStore as item, i}
					<tr>
						<td>{i + 1}</td>
						<td>
							<a
								href={`https://www.youtube.com/watch?v=${item.id}`}
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center justify-center flex-grow gap-4 px-4 py-10 font-bold rounded-2xl"
							>
								<div>
									<h4>{item.title}</h4>
									<span>{dateToHumanReadable(item.publishedAt)}</span>
								</div>
							</a>
						</td>
						<td>{secondsToHumanReadable(item.durationSec)}s</td>

						<td>
							<a
								href={`https://www.youtube.com/channel/${item.channelId}`}
								rel="noopener noreferrer"
								target="_blank"
							>
								{item.id}</a
							>
						</td>
						<td>{dateToHumanReadable(item.publishedAt)}</td>
					</tr>
				{:else}
					<tr>
						<td colspan="5">No Videos found</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>
<div id="load-more-trigger"></div>
