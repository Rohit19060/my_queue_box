<script lang="ts">
	import { IS_ADD_MODAL, READ_STORE, storeReadInIndexedDB } from '$lib/stores/ReadDB';
	import { onMount } from 'svelte';

	function closeModal() {
		suggestion = getRandomSuggestion();
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
		suggestion = getRandomSuggestion();
	}

	const suggestions = [
		'What intriguing read are you checking out today?',
		'What interesting article have you come across today?',
		'What captivating piece are you exploring today?',
		'What compelling content are you diving into today?',
		'What noteworthy item is on your radar today?',
		'What fascinating read have you discovered today?',
		'What cool resource are you looking at today?',
		'What engaging material have you found today?',
		'What exciting content are you reading through today?',
		'What remarkable piece are you exploring today?',
		'What thought-provoking article have you encountered today?',
		'What unique resource are you checking out today?',
		'What exceptional read has caught your attention today?',
		'What captivating content are you delving into today?',
		'What interesting piece are you storing today?',
		'What fresh article have you found to read today?',
		'What thrilling material are you engaging with today?',
		'What standout content is on your list today?',
		'What intriguing resource have you bookmarked for today?',
		'What engaging piece are you exploring today?'
	];

	function getRandomSuggestion() {
		const randomIndex = Math.floor(Math.random() * suggestions.length);
		return suggestions[randomIndex];
	}
	let suggestion = '';
	onMount(() => {
		suggestion = getRandomSuggestion();
	});
</script>

{#if $IS_ADD_MODAL}
	<form
		id="addBookmark"
		class="fixed inset-0 z-50 max-w-5xl p-4 px-8 mx-auto bg-white shadow-lg -xl shadow-gray-200 md:mt-44 max-h-fit"
		on:submit|preventDefault={addReadToDB}
	>
		<h2 class="mb-8 text-2xl text-center">{suggestion}</h2>
		<div class="flex items-center justify-between mb-5">
			<label for="title" class="text-xl">Title: </label>
			<input
				type="text"
				id="title"
				required
				class="w-1/2 p-2 border border-gray-300 focus:outline-none focus:border-black focus:border-opacity-75"
			/>
		</div>
		<div class="flex items-center justify-between mb-5">
			<label for="url" class="text-xl">Url: </label>
			<input
				type="url"
				id="url"
				required
				class="w-1/2 p-2 border border-gray-300 focus:outline-none focus:border-black focus:border-opacity-75"
			/>
		</div>
		<div class="flex items-center justify-between mb-5">
			<label for="desc" class="text-xl">Description: </label>
			<input
				type="text"
				id="desc"
				required
				class="w-1/2 p-2 border border-gray-300 focus:outline-none focus:border-black focus:border-opacity-75"
			/>
		</div>
		<div class="flex justify-center my-8 space-x-4">
			<button
				type="submit"
				class="cursor-pointer px-4 py-2 m-1 font-bold bg-white border-none shadow-md text-[15px] hover:bg-black hover:text-white"
			>
				Submit
			</button>
			<button
				on:click={closeModal}
				type="button"
				id="cancel"
				class="cursor-pointer px-4 py-2 m-1 font-bold bg-white border-none shadow-md text-[15px] hover:bg-black hover:text-white"
			>
				Cancel
			</button>
		</div>
	</form>
{/if}
