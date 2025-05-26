<script setup lang="ts">
import type { Block, ConnectionBlockMeta } from "~/types";

const props = defineProps<{
  editMode: boolean;
  isLast: boolean;
  isFirst: boolean;
  block: Block<ConnectionBlockMeta>;
}>();
const emit = defineEmits(["update", "delete", "up", "down"]);

const { blockEditMode, toggleEditMode, update, deleteBlock } = useBlock(
  emit,
  props,
);
const { editMode } = props;
</script>

<template>
  <div>
    <BlockConnectionEditor
      v-if="blockEditMode"
      :block="block"
      @cancel="toggleEditMode"
      @update="update"
    />
    <BlockConnectionCard
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
