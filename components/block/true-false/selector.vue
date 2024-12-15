<script setup lang="ts">
const { allowUnknown } = defineProps<{
  allowUnknown: boolean;
}>();

const items = computed(() => [
  { text: "True", value: "true" },
  { text: "False", value: "false" },
  ...(allowUnknown ? [{ text: "Unknown", value: "unknown" }] : []),
]);
</script>

<template>
  <v-select
    v-bind="$attrs"
    label="Value"
    density="compact"
    item-value="value"
    item-title="text"
    hide-selected
    variant="solo"
    :items="items"
  />
</template>
