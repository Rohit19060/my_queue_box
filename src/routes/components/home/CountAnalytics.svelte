<script>
	import Button from '../Common/Button.svelte';

	export let totalCount = 0;
	export let pendingCount = 0;
	export let label = 'Videos';
	export let undoneLabel = 'Watched';
	export let onclick = () => {};
</script>

<div class="flex flex-col">
	<div class="flex items-center justify-between">
		<div>
			<h3 class="text-lg font-semibold">{label}</h3>
			<p class="text-sm text-muted-foreground">
				You have <span class="font-bold text-black">{pendingCount}</span> out of {totalCount} yet to be {undoneLabel}
			</p>
		</div>
		<Button {onclick}></Button>
	</div>
</div>
