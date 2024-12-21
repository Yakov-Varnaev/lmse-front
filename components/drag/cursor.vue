<script setup lang="ts">
defineProps<{ drag: boolean }>();
</script>
<template>
  <div
    :class="{
      'cursor-grabbing': drag,
      'cursor-grab': !drag,
      'fill-height': true,
    }"
  >
    <slot />
  </div>
</template>
