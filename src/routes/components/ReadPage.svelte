<script lang="ts">
	import {
		fetchReadData,
		IS_ADD_MODAL,
		READ_STORE,
		removeReadFromIndexDB
	} from '$lib/stores/ReadDB';
	import { onMount } from 'svelte';
	import Button from './Common/Button.svelte';
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

{#if $READ_STORE.length > 0}
	<div class="m-4 text-center">
		{#if !$IS_ADD_MODAL}
			<Button onclick={openModal} label="Add Read" />
		{/if}
	</div>
{/if}
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
			<div
				class="flex flex-col items-center justify-center min-h-[400px] p-4 text-center bg-muted rounded-lg"
			>
				<h2 class="mb-2 text-2xl font-bold">No Reads Found</h2>
				<p class="max-w-sm mt-4 mb-20 text-muted-foreground">
					It looks like you haven't added any read links to your reading list yet. Start building
					your library today!
				</p>
				<Button onclick={openModal} label="Add Your first Read" />
			</div>
		{/each}
	</div>
</div>
<AddRead />
