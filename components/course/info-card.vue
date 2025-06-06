<script setup lang="ts">
import { enrollCourse } from "~/api/courses";
import type { Chapter, Course } from "~/types";

const context = useCourseContext();
const course = (inject("course") as Ref<Course>).value;
const chapters = (inject("chapters") as Ref<Chapter[]>).value;

const isOwner = ref(false);

onMounted(async () => {
  isOwner.value = await context.isOwner();
});

const levelChip = computed(() => {
  const level = course.level;
  switch (level) {
    case "beginner":
      return {
        color: "green",
        "prepend-icon": "mdi-signal-cellular-1",
        text: "Beginner",
      };
    case "medium":
      return {
        color: "warning",
        "prepend-icon": "mdi-signal-cellular-2",
        text: "Medium",
      };
    case "advanced":
      return {
        color: "purple",
        "prepend-icon": "mdi-signal-cellular-3",
        text: "Advanced",
      };
  }
});

const goToEditor = () => {
  navigateTo({
    name: "course-editor",
    params: { id: course.id },
  });
};

const enroll = async () => {
  try {
    await enrollCourse(course.id);
    course.isStudent = true;
  } catch (e) {
    console.log(e);
    // todo: handle this somehow
  }
};

const goToFirstChapter = () => {
  navigateTo({
    name: "chapter-detail",
    params: { id: course.id, chapterId: chapters[0].id },
  });
};
</script>

<template>
  <v-card class="pa-2" elevation="0">
    <v-chip v-bind="levelChip" />
    <v-chip v-if="course.category" :text="course.category.name" class="ma-1" />
    <v-divider class="my-2"></v-divider>
    <div class="font-weight-light text-grey text-caption">
      <div class="d-flex justify-space-between px-1 align-center">
        <span><v-icon icon="mdi-book-outline" /> Chapters </span>
        <span>{{ course.chaptersCount }}</span>
      </div>
      <div class="d-flex justify-space-between mt-1 px-1 align-center">
        <span><v-icon icon="mdi-chair-school" /> Lessons </span>
        <span>{{ course.lessonsCount }}</span>
      </div>
      <div class="d-flex justify-space-between mt-1 px-1 align-center">
        <span><v-icon icon="mdi-book-outline" /> Tasks </span>
        <span>???</span>
      </div>
      <div class="d-flex justify-space-between mt-1 px-1 align-center">
        <span><v-icon icon="mdi-video-outline" /> Media </span>
        <span>???h</span>
      </div>
    </div>
    <v-divider class="my-2"></v-divider>
    <div class="mt-3">
      <div v-if="isOwner">
        <v-btn
          block
          color="primary"
          variant="tonal"
          @click="goToEditor"
          class="rounded-xl"
        >
          edit
        </v-btn>
      </div>
      <div v-else>
        <v-row no-gutters>
          <v-col class="mr-1">
            <v-btn block variant="tonal" class="rounded-xl" color="red">
              <v-icon>mdi-heart-outline</v-icon>
            </v-btn>
          </v-col>
          <v-col class="ml-1">
            <v-btn
              prepend-icon="mdi-school-outline"
              class="rounded-xl"
              block
              variant="tonal"
              color="primary"
              @click="enroll"
            >
              Enroll
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </div>
  </v-card>
</template>
