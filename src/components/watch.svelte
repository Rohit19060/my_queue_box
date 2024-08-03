<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import UploadJson from './upload_json.svelte';
	// Define the store
	const dataStore = writable<VideoIndexDB[]>([]);
	let isLoading = false;
	const ITEMS_PER_PAGE = 100;

	async function fetchDataFromIndexedDB() {
		return new Promise<VideoIndexDB[]>((resolve, reject) => {
			const request = indexedDB.open('MyWatchDatabase', 3);

			request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
				const db = (event.target as IDBOpenDBRequest).result;
				if (!db.objectStoreNames.contains('videoStore')) {
					db.createObjectStore('videoStore', { keyPath: 'id' });
				}
			};

			request.onsuccess = (event: Event) => {
				const db = (event.target as IDBOpenDBRequest).result;
				const transaction = db.transaction('videoStore', 'readonly');
				const objectStore = transaction.objectStore('videoStore');
				const request = objectStore.getAll();
				request.onsuccess = () => resolve(request.result);
				request.onerror = (event: Event) => reject((event.target as IDBRequest).error);
			};

			request.onerror = (event: Event) => reject((event.target as IDBRequest).error);
		});
	}

	// Function to update the store with data from IndexedDB
	async function updateStore() {
		try {
			if (!indexedDB) {
				console.error('IndexedDB is not supported in this browser.');
				return;
			}
			isLoading = true;
			const data = await fetchDataFromIndexedDB();
			dataStore.set(data);
			isLoading = false;
		} catch (error) {
			console.error('Failed to fetch data:', error);
		}
	}

	onMount(() => {
		// Load initial data
		updateStore();

		// Set up event listener for data changes
		const dataChangeListener = () => updateStore();

		window.addEventListener('data-changed', dataChangeListener);

		// Clean up event listener on component unmount
		return () => {
			window.removeEventListener('data-changed', dataChangeListener);
		};
	});
</script>

<div class="text-center">
	<h1 class="text-3xl">Watch Later</h1>
</div>
<div>
	<UploadJson />

	<br/>
	{#if isLoading}
		<div class="loader"></div>
	{:else}
	<!-- Total -->
	<div class="flex items-center justify-center gap-4 px-4 py-10 font-bold rounded-2xl">
		<h4>Total</h4>
		<span>{$dataStore.length}</span>
	</div>
	{#each $dataStore as item, i}
		<div class="flex items-center w-6/12 gap-5 mx-auto">
			<img src={`https://i.ytimg.com/vi/${item.id}/mqdefault.jpg`} alt={item.title} width="200px" />
			<a
				href={`https://www.youtube.com/watch?v=${item.id}`}
				target="_blank"
				rel="noopener noreferrer"
				class="flex items-center justify-center flex-grow gap-4 px-4 py-10 font-bold rounded-2xl"
			>
				<div>
					<h4>{item.title}</h4>
					<span>{item.duration}</span>
				</div>
			</a>
			<a href={`https://www.youtube.com/channel/${item.channelId}`} rel="noopener noreferrer" target="_blank"> {item.channelTitle}</a>
		</div>
	{:else}
		<p>No Videos found</p>
	{/each}
	{/if}
</div>
