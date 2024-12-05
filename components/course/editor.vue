<script>
import {
  retrieveCourse,
  getChapters,
  updateChapter,
  deleteChapter,
  updateCourse,
  publishCourse,
  checkCourse,
} from "~/api/courses";

export default {
  setup() {
    return {
      loader: useLoader(),
      bread: useBreadcrumbs(),
      mode: useMode(),
      courseContext: useCourseContext(),
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
      errors: {},
    };
  },
  methods: {
    processDrawerItems() {
      this.drawerItems = this.chapters.map((chapter) => ({
        ...chapter,
        to: {
          name: "chapter-detail",
          params: { id: chapter.course.id, chapterId: chapter.id },
        },
      }));
    },
    async courseUpdated(updData) {
      const { data } = await updateCourse(this.courseId, updData);
      this.course = data;
      this.toggleEditMode();
    },
    async publishCourse() {
      await publishCourse(this.courseId);
      this.toggleEditMode();
    },
    async checkCourseBeforePublishing() {
      const { data } = await checkCourse(this.courseId);
      this.errors = data;
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
    async deleteChapterFromList(chapter) {
      await deleteChapter(this.courseId, chapter.id);
      this.chapters = this.chapters.filter((v) => v.id !== chapter.id);
      this.processDrawerItems();
    },
    appendChapter(newChapter) {
      this.chapters = [...this.chapters, newChapter];
      this.processDrawerItems();
    },
    toggleEditMode() {
      this.mode.toggle_edit();
    },
  },
  beforeMount() {
    this.loader.startKeyLoading("editor");
  },
  async mounted() {
    var { data } = await retrieveCourse(this.courseId);
    this.course = data;
    this.courseContext.setCourse(this.course);
    this.bread.loadFromContext();
    try {
      var { data } = await getChapters(this.courseId);
      this.chapters = data;
      this.processDrawerItems();
    } catch {}
    this.loader.stopKeyLoading("editor");
  },
  computed: {
    isLoading() {
      return this.loader.loaderMap["editor"];
    },
  },
};
</script>

<template>
  <div class="fill-height">
    <SideDrawer
      title="Chapters"
      :items="drawerItems"
      :edit-mode="mode.edit"
      @updated="updateChapterOrder"
      :onDelete="deleteChapterFromList"
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
            <v-list-item v-if="mode.edit">
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
    <v-container v-if="!isLoading" class="align-start content-container">
      <v-row dense class="content-container" justify="center">
        <v-col lg="9" xl="9">
          <InstanceEditor
            :instance="course"
            @updated="courseUpdated"
            @cancel="toggleEditMode"
            v-if="mode.edit"
          >
            <template #inline="{ data }">
              <v-textarea
                counter
                v-model="data.shortDescription"
                class="mb-3"
              />
            </template>
          </InstanceEditor>
          <InstanceCard
            v-else
            :title="course.title"
            :content="course.description"
          >
            <template #inline>
              <v-divider class="my-4"></v-divider>
              <h2>Short Description</h2>
              {{ course.shortDescription }}
              <v-divider class="my-4"></v-divider>
            </template>
          </InstanceCard>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col lg="9" xl="9">
          <v-card
            v-if="mode.edit"
            @click="checkCourseBeforePublishing"
            variant="tonal"
            color="warning"
          >
            <v-card-text class="d-flex"> Check </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col lg="9" xl="9">
          <CourseCheckTree :data="errors" />
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col lg="9" xl="9">
          <v-card
            v-if="mode.edit"
            @click="publishCourse"
            variant="tonal"
            color="primary"
          >
            <v-card-text class="d-flex"> Publish! </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
