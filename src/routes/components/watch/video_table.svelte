<script lang="ts">
	import AescDescArrow from './AescDescArrow.svelte';

	import { secondsToHumanReadable, timeAgo } from '$lib';
	import { isDesc, sortBy, SortOptionDetails, SortOptions } from '$lib/stores/videoDB';
	import Button from '../home/Button.svelte';

	export let data: VideoIndexDB[] = [];
	export let onSort = (str: SortOptions) => console.log(str);
	export let onSearch = (str: string) => console.log(str);
	export let onRemove = (str: string) => console.log(str);

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
</script>

<div class="flex flex-col gap-6 md:px-8">
	<div class="flex flex-col items-start gap-4 md:flex-row md:items-center">
		<div class="flex-1">
			<input
				class="w-full h-10 px-3 py-2 text-sm border rounded-md border-input bg-background ring-offset-backgroundplaceholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ring-orange-400"
				placeholder="Search videos..."
				type="search"
				on:input={(e) => onSearch(e.currentTarget.value || '')}
			/>
		</div>
		<div class="flex items-center gap-4">
			<!-- Example of a more customized dropdown with additional options -->
			<div class="relative inline-block text-left">
				<button
					id="dropdownButton"
					on:click={toggleDropdown}
					class="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-400 rounded-md hover:bg-orange-400 focus:outline-none"
				>
					<AescDescArrow isDesc={$isDesc} />
					<p class="text-sm text-white">{SortOptionDetails[$sortBy].str}</p>
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
					<div
						class="py-1"
						role="menu"
						aria-orientation="vertical"
						aria-labelledby="dropdownButton"
					>
						<div class="px-1 py-1 text-sm text-gray-700">
							{#each Object.values(SortOptions) as item}
								<button
									type="button"
									class="flex justify-between w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900"
									on:click={() => sortUpdated(item)}
									title="Sort by {SortOptionDetails[item].str} in {$sortBy === item ? !$isDesc ? 'descending' : 'ascending' : 'ascending'} order"
								>
									{SortOptionDetails[item].str}
									<AescDescArrow isDesc={$sortBy === item ? !$isDesc : false} color="Orange" />
								</button>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- https://i.ytimg.com/vi/{item.id}/mqdefault.jpg -->
	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
		{#each data as item, i}
			<div class="flex flex-col justify-between bg-background rounded-xl group">
				<a href="https://www.youtube.com/watch?v={item.id}">
					<div class="relative">
						<img
							src="https://i.ytimg.com/vi/{item.id}/mqdefault.jpg"
							alt={item.title}
							class="relative flex-grow object-cover w-full transition-opacity rounded-xl aspect-video group-hover:opacity-80"
						/>
						<div
							class="absolute px-2 py-1 text-sm text-white rounded-md bottom-2 left-2 bg-black/50"
						>
							{timeAgo(item.publishedAt)}
						</div>
						<div
							class="absolute px-2 py-1 text-sm text-white rounded-md bottom-2 right-2 bg-black/50"
						>
							{secondsToHumanReadable(item.durationSec)}
						</div>
					</div>
				</a>
				<div class="flex flex-col mt-3">
					<a href="https://www.youtube.com/watch?v={item.id}">
						<h3 class="font-medium capitalize line-clamp-2 min-h-12">{item.title}</h3>
					</a>
					<div class="flex items-center justify-between mt-2">
						<a
							href={`https://www.youtube.com/channel/${item.channelId}`}
							rel="noopener noreferrer"
							target="_blank"
							class="capitalize"
						>
							{item.channelTitle}</a
						>
						<Button label="Remove" onclick={() => onRemove(item.id)} className="bg-red-500" />
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
