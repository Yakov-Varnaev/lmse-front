<script setup lang="ts">
import type { VTextField } from "vuetify/components";

const emit = defineEmits<{
  (e: "perform-search", data: string): void;
}>();

const { delay = 500 } = defineProps<
  { delay: number } & { [key: string]: any }
>();
const searchQuery = ref("");
let timeoutId: NodeJS.Timeout | undefined = undefined;

watch(searchQuery, (_) => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    emit("perform-search", searchQuery.value);
  }, delay);
});
</script>

<template>
  <v-text-field v-bind="$attrs" v-model="searchQuery" />
</template>
