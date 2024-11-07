<script>
import { createCourse } from "~/api/courses";

export default {
  setup() {
    return {
      loader: useLoader(),
    };
  },
  data() {
    return {
      courseData: {
        title: "",
      },
    };
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    async create() {
      const { data } = await this.loader.withLoader(
        createCourse,
        this.courseData,
      );
      this.$emit("created", data);
    },
  },
};
</script>

<template>
  <v-card>
    <v-card-title class="bg-primary"> Create Course </v-card-title>
    <v-card-text class="mt-2 mb-0">
      <v-form class="ma-0">
        <v-text-field
          label="Title"
          class="mb-0"
          v-model.trim="courseData.title"
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-row>
        <v-col>
          <v-btn color="primary" block @click="create"> Submit</v-btn>
        </v-col>
        <v-col>
          <v-btn color="red" block @click="cancel">Cancel</v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>
