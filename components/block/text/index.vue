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
    <BlockTextEditor
      v-if="blockEditMode"
      :block="blockData"
      @cancel="toggleEditMode"
      @update="update"
    />
    <BlockTextCard
      v-else
      :block="blockData"
      :editMode="editMode"
      @edit="toggleEditMode"
      @delete="deleteBlock"
      :minify="minify"
    />
  </div>
</template>
