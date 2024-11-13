<script lang="ts">
	import { extractYouTubeId, searchYouTubeAPI } from '$lib';
	import {
		IS_DESC,
		IS_PLAY_VIDEOS,
		IS_PLAYLIST_MODAL_TYPE,
		IS_VIDEO_MODAL_OPEN,
		PLAYLIST_VIDEO_LIST,
		SEARCHED_VIDEO_DETAILS,
		SORT_BY,
		SortOptionDetails,
		SortOptions
	} from '$lib/stores/VideoDB';
	import Button from '../Common/Button.svelte';
	import AescDescArrow from './AescDescArrow.svelte';
	import YouTubePlaylistModal from './YouTubePlaylistModal.svelte';

	let isLoading = false;

	export let onSort: App.AfterSort;
	export let onSearch: App.OnSearch;

	function toggleDropdown() {
		const dropdownMenu = document.getElementById('dropdownMenu');
		if (dropdownMenu) {
			dropdownMenu.classList.toggle('hidden');
		}
	}

	function sortUpdated(sort: SortOptions) {
		onSort(sort);
		const dropdownMenu = document.getElementById('dropdownMenu');
		if (dropdownMenu) {
			dropdownMenu.classList.toggle('hidden');
		}
	}

	let hovered = false;

	function handleMouseEnter() {
		hovered = true;
	}

	function handleMouseLeave() {
		hovered = false;
	}

	async function searchYouTube() {
		onSearch('');
		const searchText = document.querySelector('#youTubeVideo') as HTMLInputElement;
		if (!searchText.value) {
			alert('Please enter a search term.');
			return;
		}
		SEARCHED_VIDEO_DETAILS.set(null);
		PLAYLIST_VIDEO_LIST.set([]);
		let extractedData = extractYouTubeId(searchText.value);
		IS_PLAYLIST_MODAL_TYPE.set(extractedData.type);
		try {
			isLoading = true;
			await searchYouTubeAPI(searchText.value);
			searchText.value = '';
		} catch (err: any) {
			SEARCHED_VIDEO_DETAILS.set(null);
		} finally {
			isLoading = false;
		}
	}
	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			searchYouTube();
		}
	}

	async function pasteFromClipboard() {
		try {
			const clipboardText = await navigator.clipboard.readText();
			if (clipboardText.includes('http')) {
				if (confirm('The clipboard contains a URL. Do you want to paste it?')) {
					const input = document.querySelector('#youTubeVideo') as HTMLInputElement;
					input.value = clipboardText;
				}
			}
		} catch (error) {
			console.error('Failed to read clipboard: ', error);
		}
	}

	const play = async () => {
		IS_VIDEO_MODAL_OPEN.set(true);
		IS_PLAY_VIDEOS.set(true);
	};
</script>

<div class="flex flex-col items-center justify-center gap-4 mx-4 my-2 md:flex-row">
	<input
		class="p-2 border border-gray-300 w-80 focus:outline-none focus:border-black focus:border-opacity-75"
		placeholder="Search or paste a YouTube video URL"
		type="search"
		id="youTubeVideo"
		on:keydown={handleKeyDown}
		on:click={pasteFromClipboard}
		on:input={(e) => {
			let searchText = (e.currentTarget as HTMLInputElement).value.trim();
			if (searchText.includes('http')) {
				onSearch('');
			} else {
				onSearch(searchText);
			}
		}}
	/>
	<div class="flex">
		<div class="flex items-center justify-center w-24">
			{#if isLoading}
				<div class="loader"></div>
			{:else}
				<Button onclick={searchYouTube} label="Search" />
			{/if}
		</div>
		<div class="relative inline-block text-left">
			<button
				id="dropdownButton"
				on:click={toggleDropdown}
				class="cursor-pointer px-4 py-2 m-1 bg-white border-none shadow-md text-[15px] hover:bg-black hover:text-white flex items-center justify-center w-full gap-2 text-sm font-medium focus:outline-none"
				on:mouseenter={handleMouseEnter}
				on:mouseleave={handleMouseLeave}
			>
				<AescDescArrow isDesc={$IS_DESC} color={hovered ? 'white' : 'black'} />
				<p>{SortOptionDetails[$SORT_BY].str}</p>
				<svg
					class="w-5 h-5 ml-2 -mr-1"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
				>
					<path
						fill-rule="evenodd"
						d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>

			<div
				id="dropdownMenu"
				class="absolute right-0 z-20 hidden w-32 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
			>
				<div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="dropdownButton">
					<div class="px-1 py-1 text-sm text-gray-700">
						{#each Object.values(SortOptions) as item}
							<button
								type="button"
								class="flex justify-between w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900"
								on:click={() => sortUpdated(item)}
								title="Sort by {SortOptionDetails[item].str} in {$SORT_BY === item
									? !$IS_DESC
										? 'descending'
										: 'ascending'
									: 'ascending'} order"
							>
								{SortOptionDetails[item].str}
								<AescDescArrow isDesc={$SORT_BY === item ? !$IS_DESC : false} color="black" />
							</button>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>

	<button class="mx-10" title="Play" on:click={play} aria-label="Play">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1"
			stroke="black"
			class="size-24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
			/>
		</svg>
	</button>
</div>
<YouTubePlaylistModal />
