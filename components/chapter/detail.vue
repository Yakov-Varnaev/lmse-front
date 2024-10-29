<script>
import { retrieveChapter } from "~/api/courses";

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
    return { loader: useLoader() };
  },
  data() {
    return {
      chapter: null,
    };
  },
  methods: {
    async loadChapter() {
      const { data } = await retrieveChapter(this.courseId, this.chapterId);
      this.chapter = data;
    },
  },
  async mounted() {
    this.loader.startLoading();
    await this.loadChapter();
    this.loader.stopLoading();
  },
};
</script>

<template>
  <div>
    <ChapterCard v-if="!loader.loading && chapter" :chapter="chapter" />
    <div v-else>loading</div>
  </div>
</template>
