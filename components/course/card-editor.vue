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
  <div class="bg-background">
    <v-text-field v-model.trim="course.title" />
    <VuetifyTiptap
      v-model.trim="course.description"
      class="editor bg-background"
      markdown-theme="github"
      max-height="650"
    />
    <v-row class="mt-2">
      <v-col>
        <v-btn block color="primary" @click="update">Save</v-btn>
      </v-col>
      <v-col>
        <v-btn block color="red" @click="cancel">Cancel</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.editor {
  position: relative;
}
</style>
