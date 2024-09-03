<script lang="ts">
	import { IS_ADD_MODAL, READ_STORE, storeReadInIndexedDB } from '$lib/stores/ReadDB';

	function closeModal() {
		IS_ADD_MODAL.set(false);
	}

	async function addReadToDB() {
		let titleField = document.getElementById('title') as HTMLInputElement;
		let urlField = document.getElementById('url') as HTMLInputElement;
		let descField = document.getElementById('desc') as HTMLInputElement;
		if (titleField.value.length === 0 || urlField.value.length === 0) {
			alert('Please fill in all fields');
			return;
		}
		try {
			const data: App.ReadIndexDB = {
				id: Date.now(),
				title: titleField.value,
				url: urlField.value,
				description: descField.value
			};
			await storeReadInIndexedDB(data);
			IS_ADD_MODAL.set(false);
			READ_STORE.update((x) => [data, ...x]);
		} catch (e) {
			console.error('Error adding read to indexDB', e);
			return;
		}
	}
</script>

{#if $IS_ADD_MODAL}
	<form
		id="addBookmark"
		class="fixed inset-0 z-50 max-w-5xl p-4 px-8 mx-auto bg-white shadow-lg rounded-xl shadow-gray-200 md:mt-44 max-h-fit"
		on:submit|preventDefault={addReadToDB}
	>
		<h2 class="mb-8 text-2xl text-center">What you got Interesting today</h2>
		<div class="flex items-center justify-between mb-5">
			<label for="title" class="text-xl">Title: </label>
			<input
				type="text"
				id="title"
				required
				class="w-1/2 p-2 border border-gray-300 rounded focus:outline-none focus:border-orange-400"
			/>
		</div>
		<div class="flex items-center justify-between mb-5">
			<label for="url" class="text-xl">Url: </label>
			<input
				type="url"
				id="url"
				required
				class="w-1/2 p-2 border border-gray-300 rounded focus:outline-none focus:border-orange-400"
			/>
		</div>
		<div class="flex items-center justify-between mb-5">
			<label for="desc" class="text-xl">Description: </label>
			<input
				type="text"
				id="desc"
				required
				class="w-1/2 p-2 border border-gray-300 rounded focus:outline-none focus:border-orange-400"
			/>
		</div>
		<div class="flex justify-center my-8 space-x-4">
			<button type="submit" class="px-4 py-2 text-white bg-orange-400 rounded hover:bg-orange-600">
				Submit
			</button>
			<button
				on:click={closeModal}
				type="button"
				id="cancel"
				class="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
			>
				Cancel
			</button>
		</div>
	</form>
{/if}
