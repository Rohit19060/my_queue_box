<script>
	import { CurrentPage, setSpaPage } from '$lib';
	import Button from './Button.svelte';

	export let totalCount = 0;
	export let pendingCount = 0;
	export let label = 'Bookmarks';
	export let undoneLabel = 'Pending Bookmarks';
</script>

<div class="flex flex-col">
	<div class="flex items-center justify-between">
		<div>
			<h3 class="text-lg font-semibold">{label}</h3>
			<p class="text-sm text-muted-foreground">
				You have <span class="font-bold text-orange-600">{pendingCount}</span>/{totalCount} {undoneLabel}
			</p>
		</div>
		<Button onclick={() => setSpaPage(CurrentPage.Watch)}></Button>
	</div>
</div>
