<script>
import { retrieveCourse, getChapters } from "~/api/courses";
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
        title: chapter.title,
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
  <div>
    <SideDrawer title="Chapters" :items="drawerItems">
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
    <v-container v-if="!loader.loading">
      <div v-if="loader.loading">loading</div>
      <CourseCardEditor
        :course="course"
        @updated="courseUpdated"
        @cancel="toggleEditMode"
        v-if="editMode"
      />
      <CourseCard v-else :course="course" @click="toggleEditMode" />
    </v-container>
  </div>
</template>
