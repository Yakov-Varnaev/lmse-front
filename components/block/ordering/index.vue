<script setup lang="ts">
import type { Block, OrderingBlockMeta } from "~/types";

const props = defineProps<{
  editMode: boolean;
  isLast: boolean;
  isFirst: boolean;
  block: Block<OrderingBlockMeta>;
}>();
const emit = defineEmits(["update", "up", "down", "delete"]);

const { blockEditMode, toggleEditMode, update, deleteBlock } = useBlock(
  emit,
  props,
);
const { editMode } = props;
</script>

<template>
  <div>
    <BlockOrderingEditor
      v-if="blockEditMode"
      :block="block"
      @cancel="toggleEditMode"
      @update="update"
    />
    <BlockOrderingCard
      v-else
      :block="block"
      :editMode="editMode"
      :isFirst="isFirst"
      :isLast="isLast"
      @up="$emit('up')"
      @down="$emit('down')"
      @edit="toggleEditMode"
      @delete="deleteBlock"
    />
  </div>
</template>
