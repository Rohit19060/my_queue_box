<script lang="ts">
	import { convertToVideoIndexDB } from '$lib';
	import { DB_NAME, DB_VERSION, dbUpgrade } from '../stores/dataStore';

	// Define the structure of the data to be stored

	let files: File[] = [];

	let isLoading = false;

	// Function to handle file upload
	const handleFileUpload = async (event: Event): Promise<void> => {
		const input = event.target as HTMLInputElement;
		if (!input.files || input.files.length === 0) return;

		files = Array.from(input.files);

		isLoading = true;

		// Create a promise to track when all files are processed
		const filePromises = files.map(
			(file) =>
				new Promise<void>((resolve, reject) => {
					if (!file) {
						resolve(); // Resolve immediately if file is null
						return;
					}

					const reader = new FileReader();
					reader.onload = async (event: ProgressEvent<FileReader>) => {
						try {
							if (!event.target?.result) {
								resolve(); // Resolve if no result
								return;
							}

							const jsonData: VideoResponse[] = JSON.parse(event.target.result as string)['items'];

							const validData = jsonData.map((item) => ({
								...item,
								id: item.details.id // or use a UUID generator
							}));
							await storeDataInIndexedDB(validData);
							resolve(); // Resolve when data is successfully stored
						} catch (error) {
							console.error(error);
							reject(error); // Reject if there's an error
						}
					};
					reader.readAsText(file);
				})
		);

		// Wait for all file promises to complete
		try {
			await Promise.all(filePromises);
			window.dispatchEvent(new Event('data-changed'));
		} finally {
			isLoading = false; // Ensure loader is hidden after processing
		}
	};

	// Function to store data in IndexedDB
	async function storeDataInIndexedDB(data: VideoResponse[]): Promise<void> {
		return new Promise((resolve, reject) => {
			    const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = dbUpgrade;

			request.onsuccess = (event: Event) => {
				const db = (event.target as IDBOpenDBRequest).result;
				const transaction = db.transaction('videoStore', 'readwrite');
				const objectStore = transaction.objectStore('videoStore');

				data.forEach((item) => {
					let convertedItem = convertToVideoIndexDB(item);
					objectStore.put(convertedItem);
				});

				transaction.oncomplete = () => {
					
					resolve();
				};
				transaction.onerror = (event: Event) => reject((event.target as IDBRequest).error);
			};

			request.onerror = (event: Event) => reject((event.target as IDBRequest).error);
		});
	}
</script>

<div>
	{#if isLoading}
		<div class="loader"></div>
	{:else}
		<!-- Custom label that triggers the file input -->
		<label for="fileInput" class="custom-file-label no-select">Upload JSON File</label>
		<!-- Hidden file input -->
		<input
			id="fileInput"
			type="file"
			accept=".json"
			class="hidden-input"
			on:change={handleFileUpload}
			multiple
		/>
	{/if}
</div>

<style>/* Apply to the entire document or specific elements */
.no-select {
  user-select: none; /* Standard syntax */
  -webkit-user-select: none; /* Chrome, Safari, and Opera */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
}
	.hidden-input {
		display: none;
	}

	.custom-file-label {
		display: inline-block;
		padding: 0.5em 1em;
		background-color: #007bff;
		color: white;
		border-radius: 4px;
		cursor: pointer;
	}

	.custom-file-label:hover {
		background-color: #0056b3;
	}


</style>
