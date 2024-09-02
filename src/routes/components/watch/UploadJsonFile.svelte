<script lang="ts">
	import { storeDataInIndexedDB } from '$lib/stores/VideoDB';
	import { onDestroy, onMount } from 'svelte';
	import Button from '../home/Button.svelte';

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

							let jsonData: App.VideoJsonResponse[] = JSON.parse(event.target.result as string)[
								'items'
							];

							const validData = jsonData.map((item) => ({
								...item,
								id: item.details.id
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

	function handleFileInputClick() {
		const fileInput = document.getElementById('fileInput') as HTMLInputElement;
		if (fileInput) {
			fileInput.click();
		}
	}

	let isMobile: boolean;

	function detectPlatform() {
		const userAgent = navigator.userAgent;
		// Basic checks for common mobile user agents
		const isMobileUserAgent = /android|iPad|iPhone|iPod/.test(userAgent);

		// Use media queries as a fallback or supplement
		const isMobileMediaQuery = window.matchMedia('(max-width: 767px)').matches;

		isMobile = isMobileUserAgent || isMobileMediaQuery;
	}

	onMount(() => {
		detectPlatform();
		window.addEventListener('resize', detectPlatform);
	});

	onDestroy(() => {
		window.removeEventListener('resize', detectPlatform);
	});
</script>

{#if !isMobile}
	<!-- content here -->
	<div>
		{#if isLoading}
			<div class="loader"></div>
		{:else}
			<Button onclick={handleFileInputClick} label="Upload JSON File" />
			<!-- Hidden file input -->
			<input
				id="fileInput"
				type="file"
				accept=".json"
				class="hidden"
				on:change={handleFileUpload}
				multiple
			/>
		{/if}
	</div>
{/if}
