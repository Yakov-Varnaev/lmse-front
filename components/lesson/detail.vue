<script>
import {
  getAnswers,
  getBlocks,
  retrieveLesson,
  updateLesson,
} from "~/api/courses";
import { useMode } from "~/stores/mode";

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
      mode: useMode(),
      courseContext: useCourseContext(),
    };
  },
  data() {
    return {
      lesson: { title: "" },
      blocks: [],
    };
  },
  methods: {
    toggleEditMode() {
      this.mode.toggle_edit();
    },
    async updateLessonTitle(updatedData) {
      const { data } = await updateLesson(
        this.courseId,
        this.chapterId,
        this.lessonId,
        updatedData,
      );
      this.lesson = data;
    },
    async loadLesson() {
      const { data } = await retrieveLesson(
        this.courseId,
        this.chapterId,
        this.lessonId,
      );
      this.lesson = data;
    },
    async loadBlocks() {
      const { data } = await getBlocks(
        this.courseId,
        this.chapterId,
        this.lessonId,
      );
      this.blocks = data;
    },
    async loadAnswers() {
      const { data } = await getAnswers(
        this.courseId,
        this.chapterId,
        this.lessonId,
      );
      this.answers = data;
    },
    blockUpdated(block) {
      this.blocks = this.blocks.map((b) => (b.id === block.id ? block : b));
    },
    blockDeleted(id) {
      this.blocks = this.blocks.filter((b) => b.id !== id);
    },
  },
  async mounted() {
    this.loader.startLoading();
    await this.loadLesson();
    this.courseContext.setLesson(this.lesson);
    this.bread.loadFromContext();
    await this.loadBlocks();
    this.loader.stopLoading();
  },
};
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col lg="8">
        <v-card v-if="!mode.edit" variant="text">
          <v-card-title> {{ lesson.title }} </v-card-title>
        </v-card>
        <TitleEditor
          v-if="mode.edit"
          @update="updateLessonTitle"
          :title="lesson.title"
        />
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col md="8">
        <BlockList
          :editMode="mode.edit"
          :blocks="blocks"
          :course-id="courseId"
          :chapter-id="chapterId"
          :lesson-id="lessonId"
          @update="blockUpdated"
          @delete="blockDeleted"
          @refetch="loadBlocks"
        />
      </v-col>
    </v-row>
    <EditToggler absolute />
  </v-container>
</template>
