<script setup lang="ts">
import { defineProps } from "vue";
import type { Course } from "~/types";

const { course } = defineProps<{ course: Course }>();

const getLevelColor = (level: string): string => {
  return (
    {
      beginner: "success",
      medium: "warning",
      advanced: "purple",
    }[level] || "default"
  );
};

const getRandomColor = (seed: string): string => {
  const colors = ["primary", "warning", "error", "info", "yellow"];
  const index = seed.charCodeAt(0) % colors.length;
  return colors[index];
};
</script>

<template>
  <v-card
    variant="flat"
    :to="{ name: 'course-detail', params: { id: course.id } }"
    class="rounded-xl fill-height d-flex flex-column"
  >
    <v-img
      v-if="course.image"
      :src="course.image"
      class="rounded-t-xl"
      cover
      height="180"
    />

    <div v-else class="image-placeholder d-flex align-center justify-center">
      <v-icon size="80">mdi-image-off-outline</v-icon>
    </div>

    <v-card-title class="d-flex justify-space-between align-center">
      <div class="text-truncate font-weight-bold">{{ course.title }}</div>
      <div class="d-flex flex-column align-end">
        <v-chip
          variant="outlined"
          :color="getLevelColor(course.level)"
          class="ma-1 text-capitalize"
          size="small"
        >
          {{ course.level }}
        </v-chip>
        <v-chip
          v-if="course.category"
          variant="outlined"
          color="primary"
          class="ma-1"
          size="small"
        >
          {{ course.category.name }}
        </v-chip>
      </div>
    </v-card-title>

    <v-card-text class="px-4">
      <div class="tags">
        <v-chip
          v-for="tag in course.tags"
          :key="tag"
          class="ma-1"
          size="small"
          :color="getRandomColor(tag)"
        >
          {{ tag }}
        </v-chip>
      </div>
      <div class="short-description mt-2">
        {{ course.shortDescription }}
      </div>
    </v-card-text>

    <v-card-actions class="mt-auto px-4 pb-4">
      <v-chip
        pill
        color="primary"
        :to="{ name: 'profile', params: { id: course.owner.id } }"
      >
        <v-icon class="mr-2">mdi-account-circle</v-icon>
        {{ course.owner.firstName }} {{ course.owner.lastName }}
      </v-chip>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.image-placeholder {
  height: 180px;
  background-color: #f0f0f0;
  border-radius: 12px 12px 0 0;
}
.short-description {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.tags {
  display: flex;
  flex-wrap: wrap;
}
</style>
