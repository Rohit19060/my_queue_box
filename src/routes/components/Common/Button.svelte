<script lang="ts">
	export let label = 'View All';
	export let ariaLabel = 'View All';
	export let onclick = () => {};
	export let className = '';
	export let type: 'button' | 'submit' | 'reset' = 'button';
</script>

<button
	on:click={onclick}
	class="cursor-pointer px-4 py-2 font-bold bg-white border-none shadow-md text-[15px] hover:bg-black hover:text-white {className}"
	aria-label={ariaLabel}
	{type}
>
	{label}
</button>
