<script setup lang="ts">
import { createCourse } from "~/api/courses";
const emit = defineEmits(["cancel", "created"]);

const courseData = reactive({
  title: "",
});
const cancel = () => {
  emit("cancel");
};

const create = async () => {
  const { data } = await createCourse(courseData);
  emit("created", data);
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
      <ButtonBlock @submit="create" @cancel="cancel" />
    </v-card-actions>
  </v-card>
</template>
