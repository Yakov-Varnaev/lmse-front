<script>
import { retrieveLesssons } from "~/api/courses";

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
      lesson: { title: "" },
    };
  },
  methods: {
    async loadLesson() {
      const { data } = await retrieveLesssons(
        this.courseId,
        this.chapterId,
        this.lessonId,
      );
      this.lesson = data;
      this.bread.addToMap(this.lesson);
    },
  },
  async mounted() {
    this.loader.startLoading();
    await this.loadLesson();
    this.loader.stopLoading();
  },
};
</script>

<template>
  <v-container>
    <h1 v-if="!loader.loading">Lesson: {{ lesson.title }}</h1>
  </v-container>
</template>
