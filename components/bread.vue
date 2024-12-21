<script setup lang="ts">
import { retrieveCourseTree } from "~/api/courses";
import type { CourseTree } from "~/types";

const overlay = ref<boolean>(false);
const alert = useAlert();

const goTo = (to: any) => {
  if (isCurrentPath(to)) {
    alert.reportWarning("You are already here!");
    return;
  }
  useRouter().push(to);
  overlay.value = false;
};

const bread = useBreadcrumbs();
const route = useRoute();

const isSmartPath = computed<boolean>(() => {
  return [
    "course-detail",
    "course-editor",
    "chapter-detail",
    "lesson-detail",
  ].includes(route.name?.toString() ?? "");
});

const isCurrentPath = (to: any): boolean => {
  const router = useRouter();
  return router.resolve(to).fullPath == useRoute().fullPath;
};

const data = ref<CourseTree | null>(null);

const courseId = computed(() => useRoute().params.id as string);

const loadData = async (): Promise<void> => {
  if (!isSmartPath.value) return;
  const { data: courseTree } = await retrieveCourseTree(courseId.value);
  data.value = courseTree;
};

watch([courseId, bread.chapterQueue, bread.lessonQueue], async () => {
  await loadData();
});
onMounted(loadData);
</script>

<template>
  <v-overlay
    class="justify-center bread-menu"
    content-class="bg-red"
    v-model="overlay"
    v-if="isSmartPath"
  >
    <template #activator="{ props }">
      <v-chip v-bind="props" color="primary" prepend-icon="mdi-menu">
        Menu
      </v-chip>
    </template>
    <v-card class="mx-auto" min-width="20vw">
      <v-card-text v-if="data !== null">
        <v-card
          class="my-2"
          variant="outlined"
          @click="goTo({ name: 'course-detail', params: { id: courseId } })"
        >
          <v-card-title>{{ data.title }}</v-card-title>
        </v-card>

        <div v-for="chapter in data.chapters">
          <v-card
            :text="chapter.title"
            variant="tonal"
            :color="
              isCurrentPath({
                name: 'chapter-detail',
                params: { id: courseId, chapterId: chapter.id },
              })
                ? 'warning'
                : 'primary'
            "
            :class="{
              'cursor-not-allowed': isCurrentPath({
                name: 'chapter-detail',
                params: { id: courseId, chapterId: chapter.id },
              }),
            }"
            aria-readonly="true"
            density="compact"
            @click="
              goTo({
                name: 'chapter-detail',
                params: { id: courseId, chapterId: chapter.id },
              })
            "
          />
          <div v-for="lesson in chapter.lessons" class="ml-5 my-2">
            <v-card
              :text="lesson.title"
              variant="text"
              color="primary"
              density="compact"
              :disabled="
                isCurrentPath({
                  name: 'lesson-detail',
                  params: {
                    id: courseId,
                    chapterId: chapter.id,
                    lessonId: lesson.id,
                  },
                })
              "
              @click="
                goTo({
                  name: 'lesson-detail',
                  params: {
                    id: courseId,
                    chapterId: chapter.id,
                    lessonId: lesson.id,
                  },
                })
              "
            />
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-overlay>
</template>

<style lang="scss" scoped>
.bread-menu {
  margin-top: 5vh;
}
</style>
