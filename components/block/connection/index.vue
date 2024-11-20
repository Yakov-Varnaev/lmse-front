<script setup>
const props = defineProps({
  editMode: { type: Boolean, required: true },
  isLast: { type: Boolean, required: true },
  isFirst: { type: Boolean, required: true },
  block: {
    type: Object,
    required: true,
  },
  data() {},
});
const emit = defineEmits(["update", "delete", "up", "down"]);

const { blockEditMode, blockData, toggleEditMode, update, deleteBlock } =
  useBlock(emit, props);
const { editMode } = props;
</script>

<template>
  <div>
    <BlockConnectionEditor
      v-if="blockEditMode"
      :block="blockData"
      @cancel="toggleEditMode"
      @update="update"
    />
    <BlockConnectionCard
      v-else
      :blockId="block.id"
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
