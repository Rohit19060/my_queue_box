<script>
	import Read from '../components/read.svelte';
	import Watch from './../components/watch.svelte';

	let currentPage = -1;
</script>

<div class="">
	{#if currentPage == -1}
		<div class="home">
			<button on:click={() => (currentPage = 0)}>Read</button>
			<button on:click={() => (currentPage = 1)}>Watch</button>
		</div>
	{:else if currentPage == 0}
		<div class="flex flex-col justify-center gap-8 text-center align-middle">
			<div class="div">
				<button on:click={() => (currentPage = -1)}>Home</button>
			</div>
			<Read />
		</div>
	{:else if currentPage == 1}
		<div class="flex flex-col justify-center gap-8 text-center align-middle">
			<div class="div">
				<button on:click={() => (currentPage = -1)}>Home</button>
			</div>
			<Watch />
		</div>
	{/if}
</div>

<style>
	.home {
		padding-top: 10%;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
	}

	button {
		border-radius: 30px;
		outline: none;
		padding: 45px;
		background-color: black;
		color: white;
		box-shadow: -1px -1px 42px 1px white;
		font-size: 70px;
	}

	button:hover {
		background-color: white;
		color: black;
		box-shadow: none;
	}

	button:active {
		box-shadow: none;
		outline: none;
		background-color: white;
		color: black;
	}
</style>
