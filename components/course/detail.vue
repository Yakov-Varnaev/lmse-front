<script lang="ts" setup>
import { getChapters, retrieveCourse } from "~/api/courses";
import type { Chapter, Course } from "~/types";

const { courseId } = defineProps<{
  courseId: string;
}>();
const loader = useLoader();
const auth = useAuth();
const context = useCourseContext();
const key = "course-detail-loading";

// @ts-ignore
const course = ref<Course>(null);
const chapters = ref<Chapter[]>([]);
provide("course", course);
provide("chapters", chapters);

const loadCourse = async () => {
  const { data } = await retrieveCourse(courseId);
  course.value = data;
};

const loadChapters = async () => {
  const { data } = await getChapters(courseId);
  chapters.value = data;
};

onBeforeMount(() => {
  loader.startKeyLoading(key);
});

onMounted(async () => {
  loader.withKeyLoader(key, async () => {
    await loadCourse();
    context.setCourse(course.value!);
    await loadChapters();
  });
});
</script>

<template>
  <v-container>
    <v-row v-if="loader.loaderMap[key]"> Loading! </v-row>
    <div v-else>
      <v-row justify="center">
        <v-col cols="12" md="4">
          <v-img :src="course.image" aspect-ratio="1 / 1" class="rounded-xl" />
          <CourseInfoCard v-if="$vuetify.display.smAndDown" />
        </v-col>
        <v-col md="8">
          <h1>{{ course.title }}</h1>
          <p>
            {{ course.shortDescription }}
          </p>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" md="4">
          <CourseInfoCard v-if="$vuetify.display.mdAndUp" />
        </v-col>
        <v-col md="8">
          <h2 class="my-2 text-primary">Description</h2>
          <VuetifyViewer :value="course.description" />
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col>
          <CourseTimeline :course="course" :chapters="chapters" />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
