import { retrieveCourse } from "~/api/courses";

export const useCourseContext = defineStore("store/course-context", {
  state: () => ({
    course: null,
  }),
  actions: {
    setCourse(course) {
      this.course = course;
    },
    async loadCourse() {
      let courseId = useRoute().params.id;
      const { data } = await retrieveCourse(courseId);
      this.setCourse(data);
    },
  },
  getters: {
    isOwner() {
      const auth = useAuth();
      if (!auth.loggedIn) return false;
      if (this.course === null) return false;
      return this.course.owner.id == auth.user.id;
    },
  },
});
