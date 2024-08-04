<script>
  export let title = "";
  export let subtitle = "";
</script>

<div class="flex items-center justify-between">
  <div>
    <h3 class="text-lg font-semibold">{title}</h3>
    <p class="text-sm text-muted-foreground">{subtitle}</p>
  </div>
  <slot name="action-button"></slot>
</div>
