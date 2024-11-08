<script>
import { createChapter } from "~/api/courses";

export default {
  props: {
    courseId: {
      type: String,
      required: true,
    },
  },
  setup() {
    return { loader: useLoader() };
  },
  data() {
    return {
      chapterData: {
        title: "",
      },
    };
  },
  methods: {
    async create() {
      const { data } = await this.loader.withLoader(
        createChapter,
        this.courseId,
        this.chapterData,
      );
      this.$emit("created", data);
    },
  },
};
</script>

<template>
  <v-card>
    <v-card-title>Create Chapter</v-card-title>
    <v-card-text>
      <v-text-field label="Title" v-model.trim="chapterData.title" />
    </v-card-text>
    <v-card-actions>
      <ButtonBlock @cancel="$emit('cancel')" @submit="create" />
    </v-card-actions>
  </v-card>
</template>
