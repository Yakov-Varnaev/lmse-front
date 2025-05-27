<script setup lang="ts">
import type { Block, TextBlockMeta } from "~/types";

const props = defineProps<{
  editMode: boolean;
  isLast: boolean;
  isFirst: boolean;
  block: Block<TextBlockMeta>;
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
    <BlockTextEditor
      v-if="blockEditMode"
      :block="block"
      @cancel="toggleEditMode"
      @update="update"
    />
    <BlockTextCard
      v-else
      :isFirst="isFirst"
      :isLast="isLast"
      :block="block"
      :editMode="editMode"
      @up="$emit('up')"
      @down="$emit('down')"
      @edit="toggleEditMode"
      @delete="deleteBlock"
    />
  </div>
</template>
