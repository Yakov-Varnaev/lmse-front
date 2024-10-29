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
  },
  async mounted() {
    this.loader.startLoading();
    let response = await retrieveCourse(this.courseId);
    this.course = response.data;
    useBreadcrumbs().addToMap(this.course);
    response = await getChapters(this.course.id);
    this.chapters = response.data;
    this.processDrawerItems();
    console.log(this.drawerItems);
    this.loader.stopLoading();
  },
};
</script>

<template>
  <div>
    <SideDrawer
      v-if="!loader.loading"
      title="Chapters"
      :items="drawerItems"
      class="mt-4"
    />
    <v-container v-if="!loader.loading">
      <div v-if="loader.loading">loading</div>
      <CourseCard :course="course" />
    </v-container>
  </div>
</template>
