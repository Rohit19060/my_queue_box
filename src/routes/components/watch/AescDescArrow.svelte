<script lang="ts">
	import AToZDown from '../Svgs/AToZDown.svelte';
	import ZToADown from '../Svgs/ZToADown.svelte';

	export let isDesc = true;
	export let color = 'white';
</script>

{#if isDesc}
	<ZToADown {color} />
{:else}
	<AToZDown {color} />
{/if}
