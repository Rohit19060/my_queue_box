<script lang="ts">
	import { CURRENT_VIDEO_ID, IS_VIDEO_MODAL_OPEN } from '$lib/stores/VideoDB';

	function closeModal() {
		IS_VIDEO_MODAL_OPEN.set(false);
	}
</script>

{#if $IS_VIDEO_MODAL_OPEN}
	<button
		class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black cursor-default bg-opacity-85"
		on:click={closeModal}
	>
		<div class="text-2xl text-white">{$CURRENT_VIDEO_ID.title}</div>
		<div class="relative w-full mx-auto my-4 overflow-hidden max-w-7xl rounded-xl">
			<div class="relative pb-[56.25%] h-0">
				<iframe
				class="absolute top-0 left-0 w-full h-full aspect-video"
				src="https://www.youtube.com/embed/{$CURRENT_VIDEO_ID.id}?autoplay=1"
				title="YouTube video player"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				allowfullscreen
				></iframe>
			</div>
		</div>
		<div class="text-2xl text-white line-clamp-3">{$CURRENT_VIDEO_ID.description}</div>
	</button>
{/if}
