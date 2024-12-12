<script>
import {
  deleteLesson,
  getLessons,
  retrieveChapter,
  updateChapter,
  updateLesson,
} from "~/api/courses";

export default {
  props: {
    courseId: {
      type: String,
      required: true,
    },
    chapterId: {
      type: String,
      required: true,
    },
  },
  setup() {
    return {
      loader: useLoader(),
      mode: useMode(),
      bread: useBreadcrumbs(),
      courseContext: useCourseContext(),
    };
  },
  data() {
    return {
      createDialog: false,
      chapter: { title: "", description: "" },
      lessons: [],
      drawerItems: [],
    };
  },
  methods: {
    processDrawerItems() {
      this.drawerItems = this.lessons.map((lesson) => ({
        ...lesson,
        to: {
          name: "lesson-detail",
          params: {
            id: this.courseId,
            chapterId: this.chapterId,
            lessonId: lesson.id,
          },
        },
      }));
    },
    toggleEditMode() {
      this.mode.toggle_edit();
    },
    toggleCreateDialog() {
      this.createDialog = !this.createDialog;
    },
    async updateChapterData(data) {
      await updateChapter(this.courseId, this.chapterId, data);
      this.chapter = data;
      this.toggleEditMode();
    },
    async updateLessonOrder(data) {
      // TODO: refetch is not optimal solution
      const { oldIndex, newIndex } = data;
      const oldLesson = this.lessons[oldIndex];
      await updateLesson(this.courseId, this.chapterId, oldLesson.id, {
        ...oldLesson,
        order: newIndex,
      });
      await this.loadLessons();
    },
    async deleteLessonItem(lesson) {
      await deleteLesson(this.courseId, this.chapterId, lesson.id);
      this.lessons = this.lessons.filter((i) => i.id !== lesson.id);
      this.processDrawerItems();
    },
    async loadChapter() {
      const { data } = await retrieveChapter(this.courseId, this.chapterId);
      this.chapter = data;
    },
    async loadLessons() {
      const { data } = await getLessons(this.courseId, this.chapterId);
      this.lessons = data;
    },
    lessonCreated(newLesson) {
      this.lessons = [...this.lessons, newLesson];
      this.processDrawerItems();
      this.toggleCreateDialog();
    },
  },
  async mounted() {
    this.loader.startLoading();
    await this.loadChapter();
    this.courseContext.setChapter(this.chapter);
    await this.courseContext.load();
    await this.bread.loadFromContext();
    await this.loadLessons();
    this.processDrawerItems();
    this.loader.stopLoading();
  },
};
</script>

<template>
  <div>
    <SideDrawer
      title="Lessons"
      :edit-mode="mode.edit"
      @updated="updateLessonOrder"
      :onDelete="deleteLessonItem"
      :items="drawerItems"
      :showActionButton="courseContext.isOwner"
      @openCreate="toggleCreateDialog"
    />
    <LessonCreateDialog
      v-model="createDialog"
      @close="toggleCreateDialog"
      @created="lessonCreated"
      :course-id="courseId"
      :chapter-id="chapterId"
    />

    <v-container v-if="!loader.loading" class="align-start content-container">
      <v-row dense class="content-container" justify="center">
        <v-col lg="9" xl="9">
          <InstanceEditor
            v-if="mode.edit"
            :instance="chapter"
            @cancel="toggleEditMode"
            @updated="updateChapterData"
          />
          <InstanceCard
            v-else
            :title="chapter.title"
            :content="chapter.description"
            @openEdit="toggleEditMode"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
