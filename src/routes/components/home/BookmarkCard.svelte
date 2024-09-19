<script lang="ts">
	export let read: App.ReadIndexDB;
</script>

<a
	class="border rounded-lg shadow-sm hover:shadow-md active:shadow-none bg-card text-card-foreground"
	href={read.url}
	aria-label={read.title}
	target="_blank"
>
	<div class="flex flex-col gap-2 p-6">
		<div class="text-sm font-medium">
			{read.title}
		</div>
		<p class="text-sm text-muted-foreground line-clamp-2">{read.description}</p>
	</div>
</a>
