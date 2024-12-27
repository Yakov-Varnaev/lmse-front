<script setup lang="ts">
import {
  deleteChapter,
  getChapters,
  retrieveCourse,
  updateChapter,
  updateCourse,
} from "~/api/courses";
import type { Chapter, Course } from "~/types";

const { courseId } = defineProps<{ courseId: string }>();
const loader = useLoader();
const bread = useBreadcrumbs();
const mode = useMode();
const courseContext = useCourseContext();

const createDialog = ref(false);
const toggleCreateDialog = () => {
  createDialog.value = !createDialog.value;
};

const course = ref<Course | null>(null);
const chapters = ref<Chapter[]>([]);
const drawerItems = ref<any>([]);

const courseUpdated = (updatedCourse: Course) => {
  course.value = updatedCourse;
  mode.toggle_edit();
};

const processDrawerItems = () => {
  drawerItems.value = chapters.value.map((chapter) => ({
    ...chapter,
    to: {
      name: "chapter-detail",
      params: { id: chapter.course.id, chapterId: chapter.id },
    },
  }));
};

const deleteChapterFromList = async (chapter: Chapter) => {
  await deleteChapter(courseId, chapter.id);
  chapters.value = chapters.value.filter((v) => v.id !== chapter.id);
  bread.removeChapter(chapter);
  processDrawerItems();
};

const appendChapter = (newChapter: Chapter) => {
  chapters.value.push(newChapter);
  bread.setChapter(newChapter);
  processDrawerItems();
};

const updateChapterOrder = async (orderData: {
  oldIndex: number;
  newIndex: number;
}) => {
  // TODO: im not sure if refetch is a good idea here.
  const { oldIndex, newIndex } = orderData;
  const oldChapter = chapters.value[oldIndex];

  await updateChapter(courseId, oldChapter.id, {
    ...oldChapter,
    order: newIndex,
  });

  const { data } = await getChapters(courseId);
  chapters.value = data;
};

const isLoading = computed(() => {
  return loader.loaderMap["editor"];
});

onBeforeMount(() => {
  loader.startKeyLoading("editor");
});

onMounted(async () => {
  const { data: courseData } = await retrieveCourse(courseId);
  course.value = courseData;
  courseContext.setCourse(course.value);
  try {
    const { data: chaptersData } = await getChapters(courseId);
    chapters.value = chaptersData;
    processDrawerItems();
  } catch {}
  loader.stopKeyLoading("editor");
});
</script>

<template>
  <div>
    <ChapterCreateDialog
      @created="appendChapter"
      :course-id="courseId"
      v-model="createDialog"
      @close="toggleCreateDialog"
    />

    <SideDrawer
      title="Chapters"
      :items="drawerItems"
      :edit-mode="mode.edit"
      @updated="updateChapterOrder"
      :onDelete="deleteChapterFromList"
      :showActionButton="courseContext.isOwner"
      @openCreate="toggleCreateDialog"
    />
    <CourseEditorForm
      v-if="mode.edit && course"
      :course="course"
      @updated="courseUpdated"
      @cancel="mode.toggle_edit"
    />
    <CourseEditorPreview v-if="!mode.edit && course" :course="course" />
  </div>
</template>
