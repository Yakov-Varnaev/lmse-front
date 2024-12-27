<script setup lang="ts">
import { getBlocks, retrieveLesson, updateLesson } from "~/api/courses";
import type { Block, Lesson } from "~/types";

const { courseId, chapterId, lessonId } = defineProps<{
  courseId: string;
  chapterId: string;
  lessonId: string;
}>();

const loader = useLoader();
const mode = useMode();
const bread = useBreadcrumbs();
const courseContext = useCourseContext();
const lesson = ref<Lesson | null>(null);
const blocks = ref<Block<any>[]>([]);

const updateLessonTitle = async (updatedData: Partial<Lesson>) => {
  const { data } = await updateLesson(
    courseId,
    chapterId,
    lessonId,
    updatedData,
  );
  lesson.value = data;
};

const loadLesson = async () => {
  const { data } = await retrieveLesson(courseId, chapterId, lessonId);
  lesson.value = data;
};

const loadBlocks = async () => {
  const { data } = await getBlocks(courseId, chapterId, lessonId);
  blocks.value = data;
};

const blockUpdated = (block: Block<any>) => {
  blocks.value = blocks.value.map((b) => (b.id === block.id ? block : b));
};

const blockDeleted = (id: string) => {
  blocks.value = blocks.value.filter((b) => b.id !== id);
};

onMounted(async () => {
  await loader.withKeyLoader("lesson-page", async () => {
    await loadLesson();
    courseContext.setLesson(lesson.value!);
    // bread.loadFromContext();
    await loadBlocks();
  });
});

const colSizes = {
  md: "12",
  lg: "8",
  xl: "6",
};
</script>

<template>
  <div>
    <v-progress-circular indeterminate v-if="loader.loaderMap['lesson-page']" />
    <v-container v-else>
      <v-row justify="center">
        <v-col v-bind="colSizes">
          <v-card v-if="!mode.edit" variant="text">
            <v-card-title> {{ lesson?.title }} </v-card-title>
          </v-card>
          <TitleEditor
            v-if="mode.edit"
            @update="updateLessonTitle"
            :title="lesson?.title || ''"
          />
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col v-bind="colSizes">
          <BlockList
            :editMode="mode.edit"
            :blocks="blocks"
            :course-id="courseId"
            :chapter-id="chapterId"
            :lesson-id="lessonId"
            @update="blockUpdated"
            @delete="blockDeleted"
            @refetch="loadBlocks"
          />
        </v-col>
      </v-row>
      <EditToggler absolute />
    </v-container>
  </div>
</template>
