<script lang="ts">
  export let label = "View All";
  export let ariaLabel = "View All";
  export let onclick = () => {};
</script>

<button
 on:click={onclick}
  class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white transition-colors bg-orange-400 rounded-md shadow h-9 hover:bg-orange-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
  aria-label={ariaLabel}
>
  {label}
</button>
