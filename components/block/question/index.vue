<script setup lang="ts">
import type { Block, QuestionBlockMeta } from "~/types";

const props = defineProps<{
  editMode: boolean;
  isLast: boolean;
  isFirst: boolean;
  block: Block<QuestionBlockMeta>;
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
    <BlockQuestionEditor
      v-if="blockEditMode"
      :block="block"
      @cancel="toggleEditMode"
      @update="update"
    />
    <BlockQuestionCard
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
