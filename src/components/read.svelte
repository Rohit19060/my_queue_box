<script lang="ts">
	let links = [
		{ id: 1, link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
		{ id: 2, link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
		{ id: 3, link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
	];
</script>

<div class="text-center">
	<h1 class="text-3xl">Read Later</h1>
</div>
<div>
	<div class="mx-auto w-fit">
		{#each links as item}
			<div class="flex items-center justify-between m-3">
				<h3 class="font-bold">{item.id}</h3>
				<a
					href={item.link}
					target="_blank"
					rel="noopener noreferrer"
					class="flex gap-4 px-10 py-4 mx-10 text-xl font-bold rounded-lg hover:shadow-md hover:shadow-slate-200"
				>
					<h3>
						{item.link}
					</h3>
				</a>
				<button>Delete</button>
			</div>
		{:else}
			<p>No links found</p>
		{/each}
	</div>
</div>
