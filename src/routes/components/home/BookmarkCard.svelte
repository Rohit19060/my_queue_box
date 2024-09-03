<script lang="ts">
	export let read: App.ReadIndexDB;
</script>

<div class="border rounded-lg shadow-sm bg-card text-card-foreground" data-v0-t="card">
	<div class="flex flex-col gap-2 p-6">
		<div class="text-sm font-medium">
			<a class="hover:underline" href={read.url} aria-label={read.title}>{read.title}</a>
		</div>
		<p class="text-sm text-muted-foreground line-clamp-2">{read.description}</p>
	</div>
</div>
