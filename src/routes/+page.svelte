<script lang="ts">
	import { CurrentPage } from '$lib';
	import { PAGE } from '$lib/stores/MainStore';
	import HomePage from './components/HomePage.svelte';
	import Read from './components/ReadPage.svelte';
	import Watch from './components/WatchPage.svelte';
	import YouTubeModal from './components/watch/YouTubeModal.svelte';
</script>

{#if $PAGE == CurrentPage.Home}
	<HomePage />
{:else if $PAGE == CurrentPage.Read}
	<Read />
{:else if $PAGE == CurrentPage.Watch}
	<Watch />
{/if}
<YouTubeModal />
