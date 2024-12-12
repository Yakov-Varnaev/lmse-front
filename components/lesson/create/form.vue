<script>
import { createLesson } from "~/api/courses";

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
      lessonData: {
        title: "",
      },
    };
  },
  methods: {
    async create() {
      const { data } = await this.loader.withLoader(
        createLesson,
        this.courseId,
        this.chapterId,
        this.lessonData,
      );
      this.$emit("created", data);
    },
  },
};
</script>

<template>
  <v-card>
    <v-card-title>Create Lesson</v-card-title>
    <v-card-text>
      <v-text-field label="Title" v-model.trim="lessonData.title" />
    </v-card-text>
    <v-card-actions>
      <ButtonBlock
        @cancel="$emit('cancel')"
        @submit="create"
        :submit-porps="{ active: !!lessonData.title.length }"
      />
    </v-card-actions>
  </v-card>
</template>
