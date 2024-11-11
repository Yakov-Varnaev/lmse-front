<script>
export default {
  emits: ["update"],
  props: {
    courseId: { type: String, required: true },
    chapterId: { type: String, required: true },
    lessonId: { type: String, required: true },
    minify: { type: Boolean, required: true },
    editMode: { type: Boolean, required: true },
    block: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      blockEditMode: false,
      blockData: { ...this.block.meta },
    };
  },
  methods: {
    toggleEditMode() {
      this.blockEditMode = !this.blockEditMode;
    },
    async updateBlock(blockData) {
      this.$emit("update", this.block, blockData);
      this.toggleEditMode();
    },
  },
};
</script>

<template>
  <div>
    <BlockTextEditor
      v-if="blockEditMode"
      :block="blockData"
      @cancel="toggleEditMode"
      @update="updateBlock"
    />
    <BlockTextCard
      v-else
      :block="blockData"
      :editMode="editMode"
      @edit="toggleEditMode"
      :minify="minify"
    />
  </div>
</template>
