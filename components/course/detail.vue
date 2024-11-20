<script>
import {
  retrieveCourse,
  getChapters,
  updateChapter,
  deleteChapter,
  getBlocks,
} from "~/api/courses";
export default {
  setup() {
    return {
      loader: useLoader(),
      bread: useBreadcrumbs(),
    };
  },
  props: {
    courseId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      course: {},
      chapters: [],
      drawerItems: [],
      editMode: false,
    };
  },
  methods: {
    processDrawerItems() {
      this.drawerItems = this.chapters.map((chapter) => ({
        ...chapter,
        to: {
          name: "chapters",
          params: { id: chapter.course.id, chapterId: chapter.id },
        },
      }));
    },
    courseUpdated(data) {
      this.course = data;
      this.toggleEditMode();
    },
    async updateChapterOrder(data) {
      // TODO: im not sure if refetch is a good idea here.
      const { oldIndex, newIndex } = data;
      const oldChapter = this.chapters[oldIndex];

      await updateChapter(this.courseId, oldChapter.id, {
        ...oldChapter,
        order: newIndex,
      });

      var { data } = await getChapters(this.courseId);
      this.chapters = data;
    },
    async deleteChapter(chapter) {
      await deleteChapter(this.courseId, chapter.id);
      this.chapters = this.chapters.filter((v) => v.id !== chapter.id);
      this.processDrawerItems();
    },
    appendChapter(newChapter) {
      this.chapters = [...this.chapters, newChapter];
      this.processDrawerItems();
    },
    toggleEditMode() {
      this.editMode = !this.editMode;
    },
  },
  async mounted() {
    this.loader.startLoading();
    var { data } = await retrieveCourse(this.courseId);
    this.course = data;
    this.bread.addToMap(this.course);
    var { data } = await getChapters(this.courseId);
    this.chapters = data;
    this.processDrawerItems();
    this.loader.stopLoading();
  },
};
</script>

<template>
  <div class="fill-height">
    <SideDrawer
      title="Chapters"
      :items="drawerItems"
      :edit-mode="editMode"
      @updated="updateChapterOrder"
      @deleted="deleteChapter"
    >
      <template v-slot:actionButton>
        <ChapterCreateDialog @created="appendChapter" :course-id="courseId">
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
              v-bind="activatorProps"
              icon
              color="primary"
              class="ml-auto"
              elevation="0"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
        </ChapterCreateDialog>
      </template>
      <template #append>
        <v-hover>
          <template #default="{ isHovering, props }">
            <v-list-item v-if="editMode">
              <v-btn
                v-bind="props"
                :class="{ 'text-red': isHovering, 'mb-1': true }"
                block
                variant="flat"
                prepend-icon="mdi-delete-outline"
              >
                Delete
              </v-btn>
            </v-list-item>
          </template>
        </v-hover>
      </template>
    </SideDrawer>
    <!-- content -->
    <v-container v-if="!loader.loading" class="align-start content-container">
      <v-row dense class="content-container" justify="center">
        <v-col lg="9" xl="9">
          <CourseCardEditor
            :course="course"
            @updated="courseUpdated"
            @cancel="toggleEditMode"
            v-if="editMode"
          />
          <CourseCard v-else :course="course" @openEdit="toggleEditMode" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.content-container {
  height: 100%;
}
</style>
