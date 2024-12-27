<script setup lang="ts">
import type { Course } from "~/types";

const { course } = defineProps<{ course: Course }>();
</script>

<template>
  <CourseEditorLayout>
    <template #top-left>
      <v-sheet class="fill-height fill-width overflow-hidden rounded-xl">
        <v-img :src="course.image" height="100%" cover />
      </v-sheet>
    </template>
    <template #top-right>
      <h2>{{ course.title }}</h2>
      <v-divider class="my-2"></v-divider>
      <v-row>
        <v-col>
          <span class="text-caption">Category:</span>
          <h3 class="font-weight-light">
            {{ course.category?.name ?? "No Category" }}
          </h3>
        </v-col>
        <v-col>
          <span class="text-caption">Level:</span>
          <h3 class="font-weight-light text-capitalize">
            {{ course.level }}
          </h3>
        </v-col>
      </v-row>
      <v-sheet class="bg-background">
        <span class="text-caption">Tags:</span>
        <CourseTagList :tags="course.tags" />
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
