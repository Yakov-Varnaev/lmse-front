<script>
import { deleteBlock, updateBlock } from "~/api/courses";
import {
  BlockConnection,
  BlockOpenQuestion,
  BlockOrdering,
  BlockQuestion,
  BlockText,
} from "#components";

export default {
  emits: ["update", "refetch", "delete"],
  props: {
    courseId: { type: String, required: true },
    chapterId: { type: String, required: true },
    lessonId: { type: String, required: true },
    editMode: { type: Boolean, required: true },
    blocks: {
      type: Array,
      required: true,
    },
  },
  provide() {
    return {
      courseId: this.courseId,
      chapterId: this.chapterId,
      lessonId: this.lessonId,
    };
  },
  data() {
    return {
      drag: false,
      componentMap: {
        text: BlockText,
        question: BlockQuestion,
        connection: BlockConnection,
        "open-question": BlockOpenQuestion,
        ordering: BlockOrdering,
      },
      deleteDialog: false,
      blockToDelete: null,
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
    toggleDeleteDialog() {
      this.deleteDialog = !this.deleteDialog;
    },
    async onBlockDelete(id) {
      this.blockToDelete = id;
      this.toggleDeleteDialog();
    },
    async performBlockDelete() {
      await deleteBlock(
        this.courseId,
        this.chapterId,
        this.lessonId,
        this.blockToDelete,
      );
      this.$emit("delete", this.blockToDelete);
      this.toggleDeleteDialog();
    },
    async moveUp(idx) {
      if (idx === 0) {
        return;
      }
      const oldBlock = this.blocks[idx];
      await updateBlock(
        this.courseId,
        this.chapterId,
        this.lessonId,
        oldBlock.id,
        {
          ...oldBlock,
          order: idx - 1,
        },
      );
      [this.blocks[idx], this.blocks[idx - 1]] = [
        this.blocks[idx - 1],
        this.blocks[idx],
      ];
      // this.$emit("refetch");
    },
    async moveDown(idx) {
      if (idx === this.blocks.length - 1) {
        return;
      }
      this.drag = true;
      setTimeout(() => (this.drag = false), 200);
      const oldBlock = this.blocks[idx];
      await updateBlock(
        this.courseId,
        this.chapterId,
        this.lessonId,
        oldBlock.id,
        {
          ...oldBlock,
          order: idx + 1,
        },
      );
      [this.blocks[idx], this.blocks[idx + 1]] = [
        this.blocks[idx + 1],
        this.blocks[idx],
      ];
      // this.$emit("refetch");
    },
  },
};
</script>

<template>
  <div>
    <v-dialog v-model="deleteDialog">
      <v-row>
        <v-col cols="3">
          <v-card>
            <v-card-text>Are you sure?</v-card-text>
            <v-card-actions>
              <ButtonBlock
                @cancel="toggleDeleteDialog"
                @submit="performBlockDelete"
              />
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-dialog>
    <div class="mt-2">
      <component
        :key="block.id"
        v-for="(block, idx) in blocks"
        class="fill-width mt-2"
        :is="{ ...componentMap[block.kind] }"
        :block="block"
        :editMode="editMode"
        :isFirst="idx === 0"
        :isLast="idx === blocks.length - 1"
        @update="updateBlockContent"
        @delete="onBlockDelete"
        @up="async () => await moveUp(idx)"
        @down="async () => await moveDown(idx)"
      />
    </div>

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
            <v-col class="text-center"><span>Add Block</span></v-col>
          </v-row>
        </v-card>
      </template>
    </BlockCreateDialog>
  </div>
</template>
