<script setup lang="ts">
import type { Course } from "~/types";

const { course } = defineProps<{ course: Course }>();
</script>

<template>
  <CourseEditorLayout>
    <template #top-right>
      <h2>{{ course.title }}</h2>
      <h3 class="font-weight-light">
        {{ course.category?.name ?? "No Category" }}
      </h3>
      <v-sheet>
        <v-chip v-for="tag in course.tags" color="primary">{{ tag }}</v-chip>
      </v-sheet>
    </template>
    <template #bottom>
      <p>
        {{ course.shortDescription }}
      </p>
      <v-divider class="my-3"></v-divider>
      <VuetifyViewer :value="course.description" class="bg-background" />
    </template>
  </CourseEditorLayout>
</template>
