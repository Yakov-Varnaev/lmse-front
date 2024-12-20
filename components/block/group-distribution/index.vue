<script setup lang="ts">
import type { Block, GroupDistributionMeta } from "~/types";

const props = defineProps<{
  editMode: boolean;
  isLast: boolean;
  isFirst: boolean;
  block: Block<GroupDistributionMeta>;
}>();
const emit = defineEmits(["update", "up", "down", "delete"]);

const { blockEditMode, toggleEditMode, update, deleteBlock } = useBlock(
  emit,
  props,
);
</script>

<template>
  <div>
    <BlockGroupDistributionEditor
      v-if="blockEditMode"
      :readonly="false"
      :block="block"
      @cancel="toggleEditMode"
      @update="update"
    />
    <BlockGroupDistributionCard
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
