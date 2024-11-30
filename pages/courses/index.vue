<script>
import { getCourses } from "~/api/courses";

export default {
  setup() {
    definePageMeta({
      name: "courses",
      middleware: "authenticated",
      crumb: "Courses",
    });

    return { loader: useLoader() };
  },
  data() {
    return {
      courses: [],
    };
  },
  methods: {
    async loadCourses() {
      const { data } = await getCourses();
      this.courses = data.results;
    },
  },
  async mounted() {
    this.loader.withLoader(this.loadCourses);
  },
};
</script>

<template>
  <v-container>
    <v-text-field label="Search" variant="outlined"></v-text-field>
    <v-navigation-drawer border="0" class="mt-4">
      <v-list-item> <h1>Filters</h1></v-list-item>
      <v-list-item>
        <v-select
          class="ma-2"
          label="tags"
          density="compact"
          variant="plain"
          multiple
          :items="['programming', 'cooking', 'fucking']"
          elevation="0"
        />
      </v-list-item>
      <v-list-item>
        <v-select
          class="ma-2"
          label="Level"
          density="compact"
          variant="plain"
          multiple
          :items="['beginner', 'medium', 'advanced']"
          elevation="0"
        />
      </v-list-item>
    </v-navigation-drawer>
    <v-row>
      <v-col cols="4" cols-md="3" v-for="course in courses" :key="course.id">
        <v-card
          variant="flat"
          :to="{ name: 'course-detail', params: { id: course.id } }"
          class="fill-height d-flex flex-column"
        >
          <div>
            <v-card-text>
              <v-img src="https://cdn.vuetifyjs.com/images/cards/house.jpg">
              </v-img>
            </v-card-text>
            <v-card-title>
              {{ course.title }}
            </v-card-title>
            <v-card-text class="short-description">
              {{ course.shortDescription }}
            </v-card-text>
          </div>

          <v-card-actions class="mt-auto">
            <v-chip
              class="mt-auto"
              pill
              color="primary"
              :to="{ name: 'profile', params: { id: course.owner.id } }"
            >
              <v-icon class="mr-2">mdi-account-circle</v-icon>
              {{ course.owner.firstName + " " + course.owner.lastName }}
            </v-chip>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-pagination></v-pagination>
      </v-col>
    </v-row>
  </v-container>
</template>
