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
    };
  },
  async mounted() {
    let response = await this.loader.withLoader(retrieveCourse, this.courseId);
    this.course = response.data;
    useBreadcrumbs().addToMap(this.course);
    this.loader.startLoading();
    response = await getChapters(this.course.id);
    this.chapters = response.data;
    this.loader.stopLoading();
  },
};
</script>

<template>
  <div>
    <v-navigation-drawer v-if="!loader.loading && course">
      <v-list-item class="pa-2">
        <h1>Chapters</h1>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item
        v-for="chapter in chapters"
        link
        :to="{
          name: 'chapters',
          params: { id: course.id, chapterId: chapter.id },
        }"
      >
        #{{ chapter.order + 1 }} {{ chapter.title }}
      </v-list-item>
    </v-navigation-drawer>

    <div v-if="loader.loading">loading</div>
    <v-container v-else>
      <CourseCard :course="course" />
    </v-container>
  </div>
</template>
