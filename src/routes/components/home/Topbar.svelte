<script>
	import { CurrentPage, setSpaPage } from '$lib';
	import { PAGE } from '$lib/stores/MainStore';
	import MenuRound from '../Svgs/MenuRound.svelte';
	import { SIDEBAR_OPEN } from '../watch/Playlist/Store/PlayListStore';
</script>

<header
	class="sticky top-0 z-50 flex flex-col items-center w-full px-4 py-3 transition-colors duration-300 bg-white shadow-sm md:pt-6"
>
	<div class="flex justify-evenly">
		<button class="flex items-center" on:click={() => setSpaPage(CurrentPage.Home)}>
			<img src="/icon.svg" alt="logo" class="w-10 h-10" />
			<span class="ml-5 text-2xl font-semibold">My Queue Box</span>
		</button>
	</div>
	<nav class="flex items-center justify-center w-full gap-5 mt-4 mb-2 text-xl">
		{#if $PAGE === CurrentPage.Watch}
			<button
				class="flex items-center justify-center w-20 mr-auto"
				on:click={() => SIDEBAR_OPEN.set(!$SIDEBAR_OPEN)}
			>
				<!-- content here -->
				<MenuRound />
			</button>
		{/if}
		<div class="flex items-center gap-5">
			<button
				class="text-lg font-semibold"
				on:click={() => setSpaPage(CurrentPage.Home)}
				disabled={$PAGE === CurrentPage.Home}
			>
				Home
				<div
					class="w-full border-b-4 {$PAGE === CurrentPage.Home
						? 'border-black'
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
						? 'border-black'
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
						? 'border-black'
						: 'border-transparent'}  rounded-b-md"
				></div>
			</button>
		</div>
		{#if $PAGE === CurrentPage.Watch}
			<div class="w-20 ml-auto"></div>
		{/if}
	</nav>
</header>
