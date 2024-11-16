<script setup>
const props = defineProps({
  minify: { type: Boolean, required: true },
  editMode: { type: Boolean, required: true },
  block: {
    type: Object,
    required: true,
  },
  data() {},
});
const emit = defineEmits(["update", "delete"]);

const { blockEditMode, blockData, toggleEditMode, update, deleteBlock } =
  useBlock(emit, props);
const { minify, editMode } = props;
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
      @edit="toggleEditMode"
      @delete="deleteBlock"
      :block="blockData"
      :editMode="editMode"
      :minify="false"
    />
  </div>
</template>
