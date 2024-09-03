<script>
	import { CurrentPage, setSpaPage } from '$lib';
	import { PAGE } from '$lib/stores/MainStore';
	import AppIcon from '../Svgs/AppIcon.svelte';
</script>

<header
	class="sticky top-0 z-50 flex flex-col items-center w-full px-4 py-3 transition-colors duration-300 bg-white shadow-sm md:pt-6"
>
	<div class="flex justify-evenly">
		<button class="flex items-center" on:click={() => setSpaPage(CurrentPage.Home)}>
			<AppIcon />
			<span class="ml-5 text-2xl font-semibold">King's Library</span>
		</button>
	</div>
	<nav class="flex gap-5 mt-4 mb-2 text-xl">
		<button
			class="text-lg font-semibold"
			on:click={() => setSpaPage(CurrentPage.Home)}
			disabled={$PAGE === CurrentPage.Home}
		>
			Home
			<div
				class="w-full border-b-4 {$PAGE === CurrentPage.Home
					? 'border-orange-400'
					: 'border-transparent'}  rounded-b-md"
			></div>
		</button>
		<button
			class="text-lg font-semibold"
			on:click={() => setSpaPage(CurrentPage.Watch)}
			disabled={$PAGE === CurrentPage.Watch}
		>
			Watch
			<div
				class="w-full border-b-4 {$PAGE === CurrentPage.Watch
					? 'border-orange-400'
					: 'border-transparent'}  rounded-b-md"
			></div>
		</button>
		<button
			class="text-lg font-semibold"
			on:click={() => setSpaPage(CurrentPage.Read)}
			disabled={$PAGE === CurrentPage.Read}
		>
			Read
			<div
				class="w-full border-b-4 {$PAGE === CurrentPage.Read
					? 'border-orange-400'
					: 'border-transparent'}  rounded-b-md"
			></div>
		</button>
	</nav>
</header>
