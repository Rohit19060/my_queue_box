<script>
  export let title = "";
  export let description = "";
  export let timeAgo = "";
  export let videoUrl = "";
  export let videoThumbnailUrl = "https://placehold.co/600x400";
</script>

<div class="border rounded-lg shadow-sm bg-card text-card-foreground" data-v0-t="card">
	<div class="flex flex-col gap-2 p-6">
		<div class="relative overflow-hidden rounded-lg aspect-video">
			<img
				src="{videoThumbnailUrl}"
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
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="w-8 h-8 text-white"
					>
						<polygon points="6 3 20 12 6 21 6 3"></polygon>
					</svg>
				</button>
			</div>
		</div>
		<div class="flex items-center justify-between">
			<div class="text-sm font-medium">
				<a class="hover:underline" href="{videoUrl}"> {title} </a>
			</div>
			<button
				class="inline-flex items-center justify-center w-10 h-10 text-sm font-medium transition-colors rounded-md whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="w-4 h-4"
				>
					<polyline points="18 8 22 12 18 16"></polyline>
					<polyline points="6 8 2 12 6 16"></polyline>
					<line x1="2" x2="22" y1="12" y2="12"></line>
				</svg>
			</button>
		</div>
		<p class="text-sm text-muted-foreground line-clamp-2">{description}</p>
		<div class="flex items-center gap-2 text-sm text-muted-foreground">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="w-4 h-4"
			>
				<circle cx="12" cy="12" r="10"></circle>
				<polyline points="12 6 12 12 16 14"></polyline>
			</svg>
			<span>{timeAgo}</span>
		</div>
	</div>
</div>
