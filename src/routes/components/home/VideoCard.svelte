<script>
	import DoubleSideArrowIcon from '../Svgs/DoubleSideArrowIcon.svelte';
	import WatchIcon from '../Svgs/WatchIcon.svelte';

	export let title = '';
	export let description = '';
	export let timeAgo = '';
	export let videoUrl = '';
	export let videoThumbnailUrl = 'https://placehold.co/600x400';
</script>

<div class="border rounded-lg shadow-sm bg-card text-card-foreground" data-v0-t="card">
	<div class="flex flex-col gap-2 p-6">
		<div class="relative overflow-hidden rounded-lg aspect-video">
			<img
				src={videoThumbnailUrl}
				alt="Video Thumbnail"
				class="object-cover w-full h-full"
				width="400"
				height="225"
				style="aspect-ratio: 400 / 225; object-fit: cover;"
			/>
			<div class="absolute inset-0 flex items-center justify-center bg-black/50">
				<button
					class="inline-flex items-center justify-center w-10 h-10 text-sm font-medium transition-colors rounded-md whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground"
				>
				</button>
			</div>
		</div>
		<div class="flex items-center justify-between">
			<div class="text-sm font-medium">
				<a class="hover:underline" href={videoUrl}> {title} </a>
			</div>
			<button
				class="inline-flex items-center justify-center w-10 h-10 text-sm font-medium transition-colors rounded-md whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground"
			>
				<DoubleSideArrowIcon />
			</button>
		</div>
		<p class="text-sm text-muted-foreground line-clamp-2">{description}</p>
		<div class="flex items-center gap-2 text-sm text-muted-foreground">
			<WatchIcon />
			<span>{timeAgo}</span>
		</div>
	</div>
</div>
