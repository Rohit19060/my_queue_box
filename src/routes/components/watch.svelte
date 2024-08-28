<script lang="ts">
	import {
		currentCursorValue,
		dataStore,
		fetchPaginatedData,
		hasMore,
		isDesc,
		removeVideoFromIndexDB,
		searchDataStore,
		searchVideos,
		sortBy,
		SortOptions
	} from '$lib/stores/videoDB';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import SearchVideo from './watch/search_video.svelte';
	import UploadJson from './watch/upload_json.svelte';
	import VideoDetails from './watch/video_details.svelte';
	import VideoTable from './watch/video_table.svelte';

	let observer: IntersectionObserver;

	let dataLoaded = true;
	let searchText = '';

	async function loadMoreItems() {
		if (!get(hasMore)) return;
		try {
			const cursorValue = get(currentCursorValue);
			const { data: newItems, nextCursorValue } = await fetchPaginatedData(
				cursorValue,
				$sortBy,
				$isDesc
			);
			if (newItems.length === 0 || nextCursorValue === null) {
				hasMore.set(false);
			} else {
				dataStore.update((items) => {
					let newItemsCopy = [...items];
					newItems.forEach((item) => {
						if (newItemsCopy.findIndex((x) => x.id === item.id) === -1) {
							newItemsCopy.push(item);
						}
					});
					return newItemsCopy;
				});
				currentCursorValue.set(nextCursorValue);
			}
		} catch (error) {
			console.error('Failed to load more items:', error);
		} finally {
			dataLoaded = false;
		}
	}

	function setupObserver() {
		if (observer) observer.disconnect();
		observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					if (searchText.length === 0) {
						loadMoreItems();
					} else {
						searchVideo(searchText, true);
					}
				}
			},
			{ rootMargin: '100px' }
		);

		const target = document.querySelector('#load-more-trigger');
		if (target) observer.observe(target);
	}

	onMount(() => {
		setupObserver();

		// Set up event listener for data changes
		const dataChangeListener = async () => {
			await reset($sortBy);
		};

		window.addEventListener('data-changed', dataChangeListener);

		// Clean up event listener on component unmount
		return () => {
			if (observer) observer.disconnect();
			window.removeEventListener('data-changed', dataChangeListener);
		};
	});

	async function reset(sortText: SortOptions) {
		if (sortText == $sortBy) {
			$isDesc = !$isDesc;
		} else {
			$sortBy = sortText;
			$isDesc = false;
		}
		dataStore.update(() => []);
		currentCursorValue.set(null);
		hasMore.set(true);
		await loadMoreItems();
	}

	async function removeVideo(id: string) {
		try {
			await removeVideoFromIndexDB(id);
			dataStore.update((x) => x.filter((x) => x.id !== id));
		} catch (e) {
			console.error('Error removing video from indexDB', e);
			return;
		}
	}

	async function searchVideo(str: string, isScroll: boolean = false) {
		searchText = str;
		if (str.length === 0) {
			reset(SortOptions.Title);
			return;
		}
		try {
			let cursorValue: IDBValidKey | null;
			if (isScroll) {
				cursorValue = get(currentCursorValue);
			} else {
				cursorValue = null;
			}
			const { data: newItems, nextCursorValue } = await searchVideos(
				cursorValue,
				$sortBy,
				$isDesc,
				str
			);
			if (isScroll) {
				dataStore.update((x) => {
					let newItemsCopy = [...x];
					newItems.forEach((item) => {
						if (newItemsCopy.findIndex((x) => x.id === item.id) === -1) {
							newItemsCopy.push(item);
						}
					});
					return newItemsCopy;
				});
			} else {
				dataStore.update(() => newItems);
			}
			currentCursorValue.set(nextCursorValue);
		} catch (e) {
			console.error('Error searching videos', e);
			return;
		}
	}
</script>

<div class="flex items-center justify-center gap-4 my-4">
	<SearchVideo />
	<UploadJson />
</div>
<VideoDetails />
{#if dataLoaded}
	<div class="loader"></div>
{:else if $searchDataStore.length > 0}
	<VideoTable
		data={$searchDataStore}
		onSort={(str) => reset(str)}
		onSearch={(str) => searchVideo(str)}
		onRemove={(str) => removeVideo(str)}
	/>
{:else}
	<VideoTable
		data={$dataStore}
		onSort={(str) => reset(str)}
		onSearch={(str) => searchVideo(str)}
		onRemove={(str) => removeVideo(str)}
	/>
{/if}

<div id="load-more-trigger"></div>
