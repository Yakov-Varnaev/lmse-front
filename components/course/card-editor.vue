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
  <v-card>
    <v-card-title>
      <v-text-field v-model.trim="course.title" />
    </v-card-title>
    <v-card-text>
      <VuetifyTiptap v-model.trim="course.description" />
    </v-card-text>
    <v-card-actions>
      <v-row>
        <v-col>
          <v-btn block color="primary" @click="update">Save</v-btn>
        </v-col>
        <v-col>
          <v-btn block color="red" @click="cancel">Cancel</v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>
