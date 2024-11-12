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

const { blockEditMode, blockData, toggleEditMode, update } = useBlock(
  emit,
  props,
);
const { minify, editMode } = props;
</script>

<template>
  <div>
    <BlockQuestionEditor
      v-if="blockEditMode"
      :block="blockData"
      @cancel="toggleEditMode"
      @update="update"
    />
    <BlockQuestionCard
      v-else
      :block="blockData"
      :editMode="editMode"
      @edit="toggleEditMode"
      :minify="minify"
    />
  </div>
</template>
