<script>
import { getBlocks, retrieveLesssons } from "~/api/courses";

export default {
  props: {
    courseId: { type: String, required: true },
    chapterId: { type: String, required: true },
    lessonId: { type: String, required: true },
  },
  setup() {
    return {
      loader: useLoader(),
      bread: useBreadcrumbs(),
    };
  },
  data() {
    return {
      editMode: false,
      lesson: { title: "" },
      blocks: [],
    };
  },
  methods: {
    toggleEditMode() {
      this.editMode = !this.editMode;
    },
    async loadLesson() {
      const { data } = await retrieveLesssons(
        this.courseId,
        this.chapterId,
        this.lessonId,
      );
      this.lesson = data;
      this.bread.addToMap(this.lesson);
    },
    async loadBlocks() {
      const { data } = await getBlocks(
        this.courseId,
        this.chapterId,
        this.lessonId,
      );
      this.blocks = data;
    },
    blockUpdated(block) {
      this.blocks = this.blocks.map((b) => (b.id === block.id ? block : b));
    },
  },
  async mounted() {
    this.loader.startLoading();
    await this.loadLesson();
    await this.loadBlocks();
    this.loader.stopLoading();
  },
};
</script>

<template>
  <v-container>
    <div class="d-flex">
      <h1 v-if="!loader.loading">Lesson: {{ lesson.title }}</h1>
      <v-btn @click="toggleEditMode"></v-btn>
    </div>
    <BlockList
      :editMode="editMode"
      :blocks="blocks"
      :course-id="courseId"
      :chapter-id="chapterId"
      :lesson-id="lessonId"
      @update="blockUpdated"
    />
  </v-container>
</template>
