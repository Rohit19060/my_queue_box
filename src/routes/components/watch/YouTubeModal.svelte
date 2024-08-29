<script>
	import { isModalOpen, videoId } from '$lib/stores/videoDB';

	function closeModal() {
		isModalOpen.set(false);
	}
</script>

{#if $isModalOpen}
	<button
		class="fixed inset-0 z-50 flex items-center justify-center bg-black cursor-default bg-opacity-85"
		on:click={closeModal}
	>
		<div class="relative w-full mx-auto overflow-hidden max-w-7xl rounded-xl">
			<div class="relative pb-[56.25%] h-0">
				<iframe
					class="absolute top-0 left-0 w-full h-full aspect-video"
					src="https://www.youtube.com/embed/{$videoId}?autoplay=1"
					title="YouTube video player"
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowfullscreen
				></iframe>
			</div>
		</div>
	</button>
{/if}
