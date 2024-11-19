<script setup>
const props = defineProps({
  minify: { type: Boolean, required: true },
  editMode: { type: Boolean, required: true },
  block: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["update"]);

const { blockEditMode, blockData, toggleEditMode, update, deleteBlock } =
  useBlock(emit, props);
const { minify, editMode } = props;
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
      @edit="toggleEditMode"
      @delete="deleteBlock"
      :minify="minify"
    />
  </div>
</template>
