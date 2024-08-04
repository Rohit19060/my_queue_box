<script>
	import { CurrentPage } from '$lib';
	import Home from '../components/Home.svelte';
	import Read from '../components/Read.svelte';
	import Watch from '../components/Watch.svelte';
	import { page } from '../stores/videoDB';
</script>

{#if $page == CurrentPage.Home}
	<Home />
{:else if $page == CurrentPage.Read}
	<Read />
{:else if $page == CurrentPage.Watch}
	<Watch />
{/if}
