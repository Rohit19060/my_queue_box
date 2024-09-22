<script lang="ts">
	import {
		CURRENT_CURSOR,
		fetchPaginatedData,
		HAS_MORE,
		IS_DESC,
		SEARCH_TEXT,
		SEARCHED_VIDEO_DETAILS,
		searchVideos,
		SORT_BY,
		SortOptions,
		VIDEO_STORE
	} from '$lib/stores/VideoDB';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import VideoDetails from './watch/VideoDetails.svelte';

	import SideBar from './watch/Playlist/Component/SideBar.svelte';
	import SearchVideo from './watch/SearchVideoForm.svelte';
	import VideoTable from './watch/VideosGrid.svelte';
	import VideosSearch from './watch/VideosSearch.svelte';

	let observer: IntersectionObserver;

	let dataLoaded = false;
	let searchText = '';

	async function loadMoreItems() {
		if (!get(HAS_MORE)) return;
		try {
			const cursorValue = get(CURRENT_CURSOR);
			const { results, nextCursorValue } = await fetchPaginatedData(
				cursorValue,
				$SORT_BY,
				$IS_DESC
			);
			if (results.length === 0 || nextCursorValue === null) {
				HAS_MORE.set(false);
			} else {
				VIDEO_STORE.update((items) => {
					let newItemsCopy = [...items];
					results.forEach((item) => {
						if (newItemsCopy.findIndex((x) => x.id === item.id) === -1) {
							newItemsCopy.push(item);
						}
					});
					return newItemsCopy;
				});
				CURRENT_CURSOR.set(nextCursorValue);
			}
		} catch (error) {
			console.error('Failed to load more items:', error);
		} finally {
			dataLoaded = true;
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
			await reset($SORT_BY, false);
		};

		window.addEventListener('data-changed', dataChangeListener);

		// Clean up event listener on component unmount
		return () => {
			if (observer) observer.disconnect();
			window.removeEventListener('data-changed', dataChangeListener);
		};
	});

	async function reset(sortText: SortOptions, shouldNotResetSort: boolean = true) {
		if (shouldNotResetSort) {
			if (sortText == $SORT_BY) {
				$IS_DESC = !$IS_DESC;
			} else {
				$SORT_BY = sortText;
				$IS_DESC = false;
			}
		}
		VIDEO_STORE.update(() => []);
		CURRENT_CURSOR.set(null);
		HAS_MORE.set(true);
		if (searchText.length === 0) {
			await loadMoreItems();
		} else {
			await searchVideo(searchText, false);
		}
	}

	async function searchVideo(str: string, isScroll: boolean = false) {
		searchText = str;
		SEARCH_TEXT.set(str);
		if (str.length === 0) {
			reset($SORT_BY, false);
			return;
		}
		try {
			let cursorValue: IDBValidKey | null;
			if (isScroll) {
				cursorValue = get(CURRENT_CURSOR);
			} else {
				cursorValue = null;
			}
			const { results, nextCursorValue } = await searchVideos(cursorValue, $SORT_BY, $IS_DESC, str);
			if (isScroll) {
				VIDEO_STORE.update((x) => {
					let newItemsCopy = [...x];
					results.forEach((item) => {
						if (newItemsCopy.findIndex((x) => x.id === item.id) === -1) {
							newItemsCopy.push(item);
						}
					});
					return newItemsCopy;
				});
			} else {
				VIDEO_STORE.update(() => results);
			}
			CURRENT_CURSOR.set(nextCursorValue);
		} catch (e) {
			console.error('Error searching videos', e);
			return;
		}
	}
</script>

<div class="flex justify-center my-4 ">
	<SearchVideo />
</div>
<div class="mx-auto">
	<VideoDetails videoDetails={$SEARCHED_VIDEO_DETAILS} />
</div>
<VideosSearch onSort={(x) => reset(x)} onSearch={(y) => searchVideo(y)} />
{#if dataLoaded}
	<VideoTable />
{:else}
	<div class="mx-auto my-20 loader"></div>
{/if}
<SideBar />
<div id="load-more-trigger"></div>
