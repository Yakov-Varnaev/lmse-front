<script setup>
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

const { blockEditMode, blockData, toggleEditMode, update, deleteBlock } =
  useBlock(emit, props);
const { editMode } = props;
</script>

<template>
  <div>
    <BlockOrderingEditor
      v-if="blockEditMode"
      :block="blockData"
      @cancel="toggleEditMode"
      @update="update"
    />
    <BlockOrderingCard
      v-else
      :block="blockData"
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
