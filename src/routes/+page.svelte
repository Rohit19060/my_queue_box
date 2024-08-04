<script>
	import { CurrentPage } from '$lib';
	import { page } from '../lib/stores/videoDB';
	import Home from './components/home.svelte';
	import Read from './components/read.svelte';
	import Watch from './components/watch.svelte';
</script>

{#if $page == CurrentPage.Home}
	<Home />
{:else if $page == CurrentPage.Read}
	<Read />
{:else if $page == CurrentPage.Watch}
	<Watch />
{/if}
