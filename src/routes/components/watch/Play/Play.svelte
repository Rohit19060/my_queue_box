<script>
	import { CURRENT_VIDEO_ID, IS_PLAY_VIDEOS, IS_VIDEO_MODAL_OPEN, setVideoAsWatched, VIDEO_STORE } from "$lib/stores/VideoDB";

	const play = async () => {
		IS_VIDEO_MODAL_OPEN.set(true);
        IS_PLAY_VIDEOS.set(true);
    };
</script> 

<button class="mx-10" title="Play" on:click={play}>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1"
		stroke="black"
		class="size-24"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
		/>
	</svg>
</button>
