<script>
	import { CurrentPage } from '$lib';
	import Home from '../components/home.svelte';
	import Read from '../components/read.svelte';
	import Watch from '../components/watch.svelte';
	import { page } from '../stores/videoDB';
</script>

{#if $page == CurrentPage.Home}
	<Home />
{:else if $page == CurrentPage.Read}
	<Read />
{:else if $page == CurrentPage.Watch}
	<Watch />
{/if}
