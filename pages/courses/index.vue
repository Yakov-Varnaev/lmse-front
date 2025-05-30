<script setup lang="ts">
import { getCategories, getCourses } from "~/api/courses";

definePageMeta({
  name: "courses",
  middleware: "authenticated",
  crumb: "Courses",
});

const { count, currentPage, show: showPaginator, pageSize } = usePage(6);
const searchQuery = ref("");
const levelQuery = ref<string[]>([]);
const categoryQuery = ref<string[]>([]);
const courses = ref<any[]>([]);
const categories = ref<any[]>([]);

const loader = useLoader();

const buildCourseParams = () => {
  const params: { search?: string; level?: string[]; category?: string[] } = {};
  if (searchQuery.value) params.search = searchQuery.value;
  if (levelQuery.value.length) params.level = levelQuery.value;
  if (categoryQuery.value.length) params.category = categoryQuery.value;
  return params;
};

const loadCourses = async () => {
  const params = buildCourseParams();
  await loader.withKeyLoader("coursePage", async () => {
    const { data } = await getCourses({
      page: currentPage.value,
      pageSize: pageSize.value,
      ...params,
    });
    courses.value = data.results;
    count.value = data.count;
  });
};

const resetAndSearchCourses = async (searchValue: string = "") => {
  searchQuery.value = searchValue;
  await resetAndLoadCourses();
};

const resetAndLoadCourses = async () => {
  currentPage.value = 1;
  await loadCourses();
};

watch([currentPage, pageSize], loadCourses);
watch([levelQuery, categoryQuery], resetAndLoadCourses);
onMounted(() => loader.withLoader(loadCourses));
</script>

<template>
  <div class="fill-height">
    <v-navigation-drawer border="0" class="mt-4">
      <v-list-item><h1>Filters</h1></v-list-item>
      <v-list-item>
        <CategorySelector
          class="ma-2"
          density="compact"
          multiple
          v-model="categoryQuery"
        />
      </v-list-item>
      <v-list-item>
        <v-select
          class="ma-2"
          label="Level"
          density="compact"
          variant="plain"
          multiple
          item-title="title"
          item-value="value"
          v-model="levelQuery"
          :items="[
            { value: 'beginner', title: 'Beginner' },
            { value: 'medium', title: 'Medium' },
            { value: 'advanced', title: 'Advanced' },
          ]"
          elevation="0"
        />
      </v-list-item>
    </v-navigation-drawer>

    <v-container height="90%">
      <v-row>
        <v-col>
          <search-field
            label="Search"
            variant="solo"
            density="comfortable"
            hide-details
            @keyup.enter="resetAndLoadCourses"
            @perform-search="resetAndSearchCourses"
          />
        </v-col>
      </v-row>

      <v-row
        v-if="loader.loaderMap['coursePage']"
        class="fill-width"
        justify="center"
        align="center"
      >
        <v-col class="d-flex flex-column" cols="1">
          <v-progress-circular indeterminate size="50" />
        </v-col>
      </v-row>

      <v-row v-else>
        <v-col
          v-for="course in courses"
          :key="course.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <CourseCard :course="course" />
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="6">
          <v-pagination
            v-if="showPaginator"
            :length="Math.ceil(count / pageSize)"
            v-model="currentPage"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style lang="scss" scoped>
.image-container {
  aspect-ratio: 1 / 1;
}
.short-description {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
</style>
