<script setup lang="ts">
import type { Block } from "~/types";

const emit = defineEmits(["edit", "delete", "up", "down"]);
const props = defineProps<{
  block: Block<{ content: string }>;
  editMode: boolean;
  isLast: boolean;
  isFirst: boolean;
}>();
</script>

<template>
  <BlockCardBase
    :edit-mode="editMode"
    :isFirst="isFirst"
    :isLast="isLast"
    :hide-bottom="true"
    :block="block"
    @up="$emit('up')"
    @down="$emit('down')"
    @edit="$emit('edit')"
    @delete="$emit('delete')"
  >
    <v-card-text v-if="block.meta.content && block.meta.content !== '<p></p>'">
      <VuetifyViewer :value="block.meta.content" class="bg-background" />
    </v-card-text>
    <v-card-title v-else class="text-grey text-h4 font-weight-black">
      Text
    </v-card-title>
  </BlockCardBase>
</template>
