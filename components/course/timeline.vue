<script setup lang="ts">
import type { Chapter, Course } from "~/types";

defineProps<{ course: Course; chapters: Chapter[] }>();
</script>

<template>
  <v-timeline truncate-line="start" align="start">
    <v-timeline-item dot-color="white"></v-timeline-item>
    <v-timeline-item v-for="chapter in chapters" dot-color="primary">
      <template v-slot:opposite>
        <h2 class="font-weight-light">
          {{ chapter.title }}
        </h2>
      </template>
      <div>
        <v-card variant="tonal" color="primary">
          <v-card-text>
            <v-list density="compact">
              <v-list-item
                v-for="lesson in chapter.lessons"
                :title="lesson.title"
              >
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </div>
    </v-timeline-item>
  </v-timeline>
</template>
