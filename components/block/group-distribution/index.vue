<script setup lang="ts">
const props = defineProps({
  editMode: { type: Boolean, required: true },
  isLast: { type: Boolean, required: true },
  isFirst: { type: Boolean, required: true },
  block: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["update", "up", "down", "delete"]);

const { blockEditMode, toggleEditMode, update, deleteBlock } = useBlock(
  emit,
  props,
);
const { editMode } = props;
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
