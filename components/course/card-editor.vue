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
  <v-tile>
    <v-text-field v-model.trim="course.title" />
    <VuetifyTiptap
      v-model.trim="course.description"
      class="editor"
      markdown-theme="github"
    />
    <v-spacer></v-spacer>
    <v-row>
      <v-col>
        <v-btn block color="primary" @click="update">Save</v-btn>
      </v-col>
      <v-col>
        <v-btn block color="red" @click="cancel">Cancel</v-btn>
      </v-col>
    </v-row>
  </v-tile>
</template>

<style scoped>
.editor {
  position: relative;
}
</style>
