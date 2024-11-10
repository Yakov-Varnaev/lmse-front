<script>
import { updateBlock } from "~/api/courses";
import { BlockQuestion, BlockText } from "#components";

export default {
  emits: ["update"],
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
    updateBlockOrder() {},
    async updateBlockContent(block, newMeta) {
      block.meta = newMeta;
      const { data } = await updateBlock(
        this.courseId,
        this.chapterId,
        this.lessonId,
        block.id,
        block,
      );
      console.log(data);
      this.$emit("update", data);
    },
  },
};
</script>

<template>
  <v-container>
    <!-- Super unsure if this is ok -->
    <h1 v-if="editMode">Edit!!!</h1>
    <draggable
      @start="drag = true"
      @end="drag = false"
      :list="blocks"
      item-key="id"
      @update="updateBlockOrder"
      :disabled="!editMode"
    >
      <template v-slot:item="{ element: block }">
        <div class="mt-2">
          <component
            :is="{ ...componentMap[block.type] }"
            :minify="drag"
            :block="block"
            :course-id="courseId"
            :chapter-id="chapterId"
            :lesson-id="lessonId"
            @update="updateBlockContent"
          />
        </div>
      </template>
    </draggable>
  </v-container>
</template>
