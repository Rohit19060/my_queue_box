<script lang="ts">
	import {
		CURRENT_VIDEO_ID,
		IS_PLAY_VIDEOS,
		IS_VIDEO_MODAL_OPEN,
		VIDEO_STORE
	} from '$lib/stores/VideoDB';

	function closeModal() {
		IS_VIDEO_MODAL_OPEN.set(false);
	}

	$: ids = $VIDEO_STORE.slice(0, 100).map((x) => x.id).join(',');
</script>

{#if $IS_VIDEO_MODAL_OPEN}
	<button
		class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black cursor-default bg-opacity-85"
		on:click={closeModal}
	>
		<div class="relative w-full mx-auto my-4 overflow-hidden max-w-7xl rounded-xl">
			<div class="relative pb-[56.25%] h-0">
				{#if $IS_PLAY_VIDEOS}
					<iframe
						class="absolute top-0 left-0 w-full h-full aspect-video"
						src="https://www.youtube.com/embed?autoplay=1&playlist={ids}&modestbranding=1&rel=0&playsinline=1"
						title="YouTube video player"
						frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						allowfullscreen
					></iframe>
				{:else}
					<iframe
						class="absolute top-0 left-0 w-full h-full aspect-video"
						src="https://www.youtube.com/embed/{$CURRENT_VIDEO_ID}?autoplay=1&modestbranding=1&rel=0&playsinline=1"
						title="YouTube video player"
						frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						allowfullscreen
					></iframe>
				{/if}
			</div>
		</div>
	</button>
{/if}
