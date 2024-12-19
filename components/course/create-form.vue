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

const submitActive = computed(() => courseData.title.length > 0);
</script>

<template>
  <v-card>
    <v-card-title class="bg-primary"> Create Course </v-card-title>
    <v-card-text class="mt-2 mb-0">
      <v-form class="ma-0" @submit.prevent>
        <v-text-field
          label="Title"
          class="mb-0"
          @keyup.enter="create"
          v-model.trim="courseData.title"
          id="course-create-form-title-input"
        >
        </v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <ButtonBlock
        @submit="create"
        @cancel="cancel"
        :submitPorps="{ active: submitActive }"
      />
    </v-card-actions>
  </v-card>
</template>
