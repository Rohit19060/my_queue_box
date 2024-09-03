<script lang="ts">
	import { IS_DESC, SORT_BY, SortOptionDetails, SortOptions } from '$lib/stores/VideoDB';
	import AescDescArrow from './AescDescArrow.svelte';

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
</script>

<div class="flex items-center justify-center gap-4">
	<input
		class="w-full h-10 max-w-4xl px-3 py-2 text-sm border rounded-md border-input bg-background ring-offset-backgroundplaceholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ring-orange-400"
		placeholder="Search videos..."
		type="search"
		on:input={(e) => onSearch(e.currentTarget.value || '')}
	/>
	<div class="flex items-center gap-4">
		<div class="relative inline-block text-left">
			<button
				id="dropdownButton"
				on:click={toggleDropdown}
				class="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-400 rounded-md hover:bg-orange-400 focus:outline-none"
			>
				<AescDescArrow isDesc={$IS_DESC} />
				<p class="text-sm text-white">{SortOptionDetails[$SORT_BY].str}</p>
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
								<AescDescArrow isDesc={$SORT_BY === item ? !$IS_DESC : false} color="Orange" />
							</button>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
