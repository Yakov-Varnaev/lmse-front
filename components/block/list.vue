<script>
import { updateBlock } from "~/api/courses";
import { BlockQuestion, BlockText } from "#components";

export default {
  emits: ["update", "refetch"],
  props: {
    editMode: { type: Boolean, required: true },
    courseId: { type: String, required: true },
    chapterId: { type: String, required: true },
    lessonId: { type: String, required: true },
    blocks: {
      type: Array,
      required: Boolean,
    },
  },
  data() {
    return {
      drag: false,
      componentMap: {
        text: BlockText,
        question: BlockQuestion,
      },
    };
  },
  methods: {
    async updateBlockOrder({ oldIndex, newIndex }) {
      // Looks unhealthy...
      const oldBlock = this.blocks[newIndex];
      await updateBlock(
        this.courseId,
        this.chapterId,
        this.lessonId,
        oldBlock.id,
        {
          ...oldBlock,
          order: newIndex,
        },
      );
      this.$emit("refetch");
    },
    async updateBlockContent(block, newMeta) {
      block.meta = newMeta;
      const { data } = await updateBlock(
        this.courseId,
        this.chapterId,
        this.lessonId,
        block.id,
        block,
      );
      this.$emit("update", data);
    },
  },
};
</script>

<template>
  <v-container>
    <!-- Super unsure if this is ok -->
    <draggable
      @start="drag = true"
      @end="drag = false"
      :list="blocks"
      item-key="id"
      @update="updateBlockOrder"
      drag-class="minified"
      :disabled="!editMode"
    >
      <template v-slot:item="{ element: block }">
        <div class="mt-2">
          <component
            :is="{ ...componentMap[block.type] }"
            :minify="drag"
            :block="block"
            :editMode="editMode"
            @update="updateBlockContent"
          />
        </div>
      </template>
    </draggable>
  </v-container>
</template>

<style lang="scss">
.minified {
  overflow-y: hidden;
  max-height: 200px;
}
</style>
