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
const emit = defineEmits(["update", "delete", "up", "down"]);

const { blockEditMode, blockData, toggleEditMode, update, deleteBlock } =
  useBlock(emit, props);
const { editMode } = props;
</script>

<template>
  <div>
    <BlockTextEditor
      v-if="blockEditMode"
      :block="blockData"
      @cancel="toggleEditMode"
      @update="update"
    />
    <BlockTextCard
      v-else
      :isFirst="isFirst"
      :isLast="isLast"
      :block="blockData"
      :editMode="editMode"
      @up="$emit('up')"
      @down="$emit('down')"
      @edit="toggleEditMode"
      @delete="deleteBlock"
    />
  </div>
</template>
