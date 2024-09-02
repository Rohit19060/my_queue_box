<script>
	import { CurrentPage } from '$lib';
	import { PAGE } from '$lib/stores/SpaStore';
	import Home from './components/Home.svelte';
	import Read from './components/Read.svelte';
	import Watch from './components/Watch.svelte';
</script>

{#if $PAGE == CurrentPage.Home}
	<Home />
{:else if $PAGE == CurrentPage.Read}
	<Read />
{:else if $PAGE == CurrentPage.Watch}
	<Watch />
{/if}
