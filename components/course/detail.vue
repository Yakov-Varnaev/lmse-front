<script>
import {
  retrieveCourse,
  getChapters,
  updateChapter,
  deleteChapter,
} from "~/api/courses";
export default {
  setup() {
    return {
      loader: useLoader(),
    };
  },
  props: {
    courseId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      course: {},
      chapters: [],
      drawerItems: [],
      editMode: false,
    };
  },
  methods: {
    processDrawerItems() {
      this.drawerItems = this.chapters.map((chapter) => ({
        ...chapter,
        to: {
          name: "chapters",
          params: { id: chapter.course.id, chapterId: chapter.id },
        },
      }));
    },
    courseUpdated(data) {
      this.course = data;
      this.toggleEditMode();
    },
    async updateChapterOrder(data) {
      const { oldIndex, newIndex } = data;
      const oldChapter = this.chapters[oldIndex];
      await updateChapter(this.courseId, oldChapter.id, {
        ...oldChapter,
        order: newIndex,
      });
    },
    async deleteChapter(chapter) {
      await deleteChapter(this.courseId, chapter.id);
      this.chapters = this.chapters.filter((v) => v.id !== chapter.id);
      this.processDrawerItems();
    },
    appendChapter(newChapter) {
      this.chapters = [...this.chapters, newChapter];
      this.processDrawerItems();
    },
    toggleEditMode() {
      this.editMode = !this.editMode;
    },
  },
  async mounted() {
    this.loader.startLoading();
    var { data } = await retrieveCourse(this.courseId);
    this.course = data;
    var { data } = await getChapters(this.courseId);
    this.chapters = data;
    this.processDrawerItems();
    this.loader.stopLoading();
  },
};
</script>

<template>
  <div class="fill-height">
    <SideDrawer
      title="Chapters"
      :items="drawerItems"
      :edit-mode="editMode"
      @updated="updateChapterOrder"
      @deleted="deleteChapter"
    >
      <template v-slot:actionButton>
        <ChapterCreateDialog @created="appendChapter" :course-id="courseId">
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
              v-bind="activatorProps"
              icon
              color="primary"
              class="ml-auto"
              elevation="0"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
        </ChapterCreateDialog>
      </template>
    </SideDrawer>
    <!-- content -->
    <v-container v-if="!loader.loading" class="fill-height align-start">
      <v-row dense no-gutters class="fill-height" justify="center">
        <v-col cols="9">
          <v-sheet max-width="1000">
            <CourseCardEditor
              :course="course"
              @updated="courseUpdated"
              @cancel="toggleEditMode"
              v-if="editMode"
              class="fill-height"
            />
            <CourseCard v-else :course="course" @openEdit="toggleEditMode" />
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
