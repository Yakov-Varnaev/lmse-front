<script>
import { deleteBlock, updateBlock } from "~/api/courses";
import { BlockConnection, BlockQuestion, BlockText } from "#components";

export default {
  emits: ["update", "refetch", "delete"],
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
        connection: BlockConnection,
      },
    };
  },
  methods: {
    appendBlock() {
      // TODO: no need to refetch actually
      this.$emit("refetch");
    },
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
    async onBlockDelete(id) {
      await deleteBlock(this.courseId, this.chapterId, this.lessonId, id);
      this.$emit("delete", id);
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
            :is="{ ...componentMap[block.kind] }"
            :minify="drag"
            :block="block"
            :editMode="editMode"
            @update="updateBlockContent"
            @delete="onBlockDelete"
          />
        </div>
      </template>
    </draggable>

    <BlockCreateDialog
      :course-id="courseId"
      :chapter-id="chapterId"
      :lesson-id="lessonId"
      @created="appendBlock"
      v-if="editMode"
    >
      <template #activator="{ props }">
        <v-card
          v-bind="props"
          variant="tonal"
          color="primary"
          elevation="0"
          class="mt-4 pa-5"
        >
          <v-row align="center" no-gutters>
            <v-col class="text-center"> <span>Add Block </span></v-col>
          </v-row>
        </v-card>
      </template>
    </BlockCreateDialog>
  </v-container>
</template>

<style lang="scss">
.minified {
  overflow-y: hidden;
  max-height: 200px;
}
</style>
