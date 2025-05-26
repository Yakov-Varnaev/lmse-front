<script setup lang="ts">
import type { Block, OpenQuestionBlockMeta } from "~/types";

const props = defineProps<{
  editMode: boolean;
  isLast: boolean;
  isFirst: boolean;
  block: Block<OpenQuestionBlockMeta>;
}>();
const emit = defineEmits(["update", "delete", "up", "down"]);

const { blockEditMode, toggleEditMode, update, deleteBlock } = useBlock(
  emit,
  props,
);
</script>

<template>
  <div>
    <BlockOpenQuestionEditor
      v-if="blockEditMode"
      :block="block"
      @cancel="toggleEditMode"
      @update="update"
    />
    <BlockOpenQuestionCard
      v-else
      :block="deepCopy(block)"
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
