<script lang="ts">
	import {
		fetchReadData,
		IS_ADD_MODAL,
		READ_STORE,
		removeReadFromIndexDB
	} from '$lib/stores/ReadDB';
	import { onMount } from 'svelte';
	import Button from './home/Button.svelte';
	import AddRead from './Read/AddRead.svelte';
	import TrashIcon from './Svgs/TrashIcon.svelte';

	function openModal() {
		IS_ADD_MODAL.set(true);
	}

	onMount(async () => {
		let x = await fetchReadData();
		READ_STORE.set(x.results);
	});

	async function removeRead(id: number) {
		try {
			await removeReadFromIndexDB(id);
			READ_STORE.update((x) => x.filter((x) => x.id !== id));
		} catch (e) {
			console.error('Error removing read from indexDB', e);
			return;
		}
	}
</script>

<div class="m-4 text-center">
	{#if !$IS_ADD_MODAL}
		<Button onclick={openModal} label="Add Read" />
	{/if}
</div>
<div>
	<div class="mx-auto w-fit">
		{#each $READ_STORE as item}
			<div class="flex items-center justify-between m-3">
				<a
					href={item.url}
					target="_blank"
					rel="noopener noreferrer"
					class="flex gap-4 px-10 py-4 mx-10 text-xl font-bold rounded-lg hover:shadow-md hover:shadow-slate-200"
				>
					<h3>
						{item.title.length > 0 ? item.title : item.url}
					</h3>
				</a>
				<button on:click={() => removeRead(item.id)}><TrashIcon /></button>
			</div>
		{:else}
			<p>No Reads found</p>
		{/each}
	</div>
</div>
<AddRead />
