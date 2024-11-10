<script>
export default {
  emits: ["update"],
  props: {
    courseId: { type: String, required: true },
    chapterId: { type: String, required: true },
    lessonId: { type: String, required: true },
    minify: { type: Boolean, required: true },
    block: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      editMode: false,
      content: this.block.meta.content,
      blockData: { ...this.block.meta },
    };
  },
  methods: {
    toggleEditMode() {
      this.editMode = !this.editMode;
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
      v-if="editMode"
      :block="blockData"
      @cancel="toggleEditMode"
      @update="updateBlock"
    />
    <BlockTextCard
      v-else
      :block="blockData"
      @edit="toggleEditMode"
      :minify="minify"
    />
  </div>
</template>

<style scoped>
.minify {
  max-height: 50px;
  color: red;
}
</style>
