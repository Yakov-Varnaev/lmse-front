<script>
import { updateCourse } from "~/api/courses";

export default {
  props: {
    course: {
      type: Object,
      required: true,
    },
  },
  setup() {
    return { loader: useLoader() };
  },
  data() {
    return {};
  },
  methods: {
    async update() {
      const { data } = await updateCourse(this.course.id, this.course);
      this.$emit("updated", data);
    },
    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>

<template>
  <v-container class="bg-background editor-container">
    <v-text-field v-model.trim="course.title" />
    <VuetifyTiptap
      v-model.trim="course.description"
      class="editor bg-background"
      markdown-theme="github"
    />
    <v-row class="mt-auto">
      <v-col>
        <v-btn block color="primary" @click="update">Save</v-btn>
      </v-col>
      <v-col>
        <v-btn block color="red" @click="cancel">Cancel</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.editor-container {
  height: 100%;
}

.editor {
  position: relative;
}
</style>
