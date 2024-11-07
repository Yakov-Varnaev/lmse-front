<script>
import { getCourses } from "~/api/courses";

export default {
  props: {
    userId: {
      type: String,
      required: true,
    },
  },
  setup() {
    return { loader: useLoader() };
  },
  data() {
    return {
      courses: [],
    };
  },
  methods: {
    appendNewCourse(data) {
      this.courses = [data, ...this.courses];
    },
    async fetchCourses() {
      const { data } = await getCourses({ author: this.userId });
      this.courses = data.results;
    },
  },
  async mounted() {
    await this.loader.withLoader(this.fetchCourses);
  },
};
</script>

<template>
  <div>
    <div class="d-flex justify-space-between mb-2 pa-2 bg-primary rounded">
      <h1>Courses</h1>
      <CourseCreateOverlay @append="appendNewCourse" />
    </div>
    <CourseList :courses="courses" />
  </div>
</template>
