<script>
import { deleteCourse, getCourses } from "~/api/courses";

export default {
  props: {
    userId: {
      type: String,
      required: true,
    },
  },
  setup() {
    return { loader: useLoader(), auth: useAuth() };
  },
  data() {
    return {
      courses: [],
    };
  },
  methods: {
    appendNewCourse(data) {
      this.courses.push(data);
    },
    async deleteCourse(course) {
      await deleteCourse(course.id);
      if (course.state == "published") {
        // TODO: well, this is no good tbh
        course.state = "archived";
      } else {
        this.courses = this.courses.filter((c) => c.id !== course.id);
      }
    },
    async fetchCourses() {
      const { data } = await getCourses({ author: this.userId });
      this.courses = data.results;
    },
  },
  computed: {
    isAuthor() {
      return this.auth.user.id === this.userId;
    },
  },
  async mounted() {
    await this.loader.withLoader(this.fetchCourses);
  },
};
</script>

<template>
  <div>
    <div class="d-flex justify-space-between mb-2 bg-primary rounded-pill pa-2">
      <h1>Courses</h1>
      <CourseCreateOverlay @append="appendNewCourse" v-if="isAuthor" />
    </div>
    <CourseList
      :courses="courses"
      @delete="deleteCourse"
      :isAuthor="isAuthor"
    />
  </div>
</template>
