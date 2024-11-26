<script>
import { enrollCourse, getChapters, retrieveCourse } from "~/api/courses";

export default {
  props: {
    courseId: { type: String, required: true },
  },
  setup() {
    return {
      loader: useLoader(),
      auth: useAuth(),
      context: useCourseContext(),
    };
  },
  data() {
    return {
      key: "course-detail",
      course: {},
      chapters: [],
    };
  },
  methods: {
    goToEditor() {
      navigateTo({
        name: "chapter-detail",
        params: { id: this.course.id, chapterId: this.chapters[0].id },
      });
    },
    async enroll() {
      console.log("here");
      try {
        await enrollCourse(this.course.id);
        this.course.isStudent = true;
      } catch (e) {
        console.log(e);
        // todo: handle this somehow
      }
    },
    goToFirstChapter() {
      navigateTo({
        name: "chapter-detail",
        params: { id: this.course.id, chapterId: this.chapters[0].id },
      });
    },
    async loadCourse() {
      const { data } = await retrieveCourse(this.courseId);
      this.context.setCourse(data);
      this.course = data;
    },
    async loadChapters() {
      const { data } = await getChapters(this.courseId);
      this.chapters = data;
    },
  },
  async mounted() {
    this.loader.startKeyLoading(this.key);
    await this.loadCourse();
    await this.loadChapters();
    this.loader.stopKeyLoading(this.key);
  },
};
</script>
<template>
  <v-container>
    <v-row>
      <!-- side -->
      <v-col lg="3" md="12" cols="12">
        <v-card
          variant="tonal"
          color="primary"
          :loading="loader.loaderMap[key]"
        >
          <v-card-title>
            {{ course.title }}
          </v-card-title>
          <v-card-subtitle>
            by
            <v-chip prepend-icon="mdi-at">
              {{ course.owner?.firstName }} {{ course.owner?.lastName }}
            </v-chip>
          </v-card-subtitle>
          <v-card-text>
            <div class="text-center">
              <v-rating hover lenght="5" model-value="5"></v-rating>
            </div>
          </v-card-text>
          <v-divider class="mx-2"></v-divider>
          <v-card-actions class="pt-0">
            <v-chip
              v-if="!course.isStudent && !context.isOwner"
              @click=""
              class="centered-chip"
            >
              <v-icon icon="mdi-heart-outline" />
            </v-chip>
            <v-chip
              v-if="!course.isStudent && !context.isOwner"
              @click="enroll"
              color="success"
              class="centered-chip"
            >
              <span class="d-flex justify-center"> Enroll </span>
            </v-chip>
            <v-chip
              v-if="course.isStudent"
              @click="goToFirstChapter"
              color="success"
              class="centered-chip"
              prepend-icon="mdi-school-outline"
            >
              Learn
            </v-chip>
            <v-chip
              v-if="context.isOwner"
              @click="goToEditor"
              class="centered-chip"
            >
              Edit
            </v-chip>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- main -->
      <v-col>
        <v-row no-gutters>
          <v-card variant="text" color="primary">
            <v-card-text>
              {{ course.shortDescription }}
            </v-card-text>
          </v-card>
          <v-divider class="my-4"></v-divider>
        </v-row>
        <v-row>
          <v-col>
            <v-card variant="text">
              <v-card-text>
                <VuetifyViewer :value="course.description" />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-treeview
              :items="chapters"
              item-children="lessons"
              open-all
              item-value="id"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss">
.centered-chip {
  width: 100%;
  justify-content: center;
}
</style>
