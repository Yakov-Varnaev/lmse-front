<script setup>
const props = defineProps({
  minify: { type: Boolean, required: true },
  editMode: { type: Boolean, required: true },
  block: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["update", "delete"]);

const { blockEditMode, blockData, toggleEditMode, update, deleteBlock } =
  useBlock(emit, props);
const { minify, editMode } = props;
</script>

<template>
  <div>
    <BlockConnectionCard :block="blockData" :editMode="editMode" />
  </div>
</template>
