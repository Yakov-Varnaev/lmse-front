<script>
import { getBlocks, retrieveLesssons, updateLesson } from "~/api/courses";

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
    blockDeleted(id) {
      this.blocks = this.blocks.filter((b) => b.id !== id);
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
    <v-row justify="center">
      <v-col lg="8">
        <v-card v-if="!editMode" variant="text">
          <v-card-title> {{ lesson.title }} </v-card-title>
        </v-card>
        <TitleEditor
          v-if="editMode"
          @update="updateLessonTitle"
          :title="lesson.title"
        />
        <v-btn
          class="ml-auto position-absolute bottom-0 left-0"
          variant="outlined"
          @click="toggleEditMode"
        >
          {{ editMode ? "normal mode" : "edit mode" }}
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <BlockList
          :editMode="editMode"
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
  </v-container>
</template>
