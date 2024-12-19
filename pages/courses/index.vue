<script setup lang="ts">
import { getCategories, getCourses } from "~/api/courses";
definePageMeta({
  name: "courses",
  middleware: "authenticated",
  crumb: "Courses",
});

const { count, currentPage, show: showPaginator, pageSize } = usePage(6);

const searchQuery = ref("");
const courses = ref<any[]>([]);
const levelQuery = ref<string[]>([]);

const categories = ref<any[]>([]);
const categoryQuery = ref<string[]>([]);

const loader = useLoader();

const loadCourses = async () => {
  const params: { search?: string; level?: string[]; category?: string[] } = {};
  if (searchQuery.value.length > 0) {
    params.search = searchQuery.value;
  }
  if (levelQuery.value.length) {
    params.level = levelQuery.value;
  }
  if (categoryQuery.value) {
    params.category = categoryQuery.value;
  }
  await loader.withKeyLoader("coursePage", async (): Promise<void> => {
    const { data } = await getCourses({
      page: currentPage.value,
      pageSize: pageSize.value,
      ...params,
    });
    courses.value = data.results;
    count.value = data.count;
  });
};

const loadCategories = async () => {
  loader.withKeyLoader("category", async () => {
    if (categories.value.length) return;
    const { data } = await getCategories();
    categories.value = data;
  });
};

const loadCoursesWithPageDrop = async () => {
  currentPage.value = 1;
  await loadCourses();
};

watch([currentPage, pageSize], loadCourses);
watch([levelQuery, categoryQuery], loadCoursesWithPageDrop);

onMounted(() => {
  loader.withLoader(loadCourses);
});
</script>

<template>
  <div class="fill-height">
    <v-navigation-drawer border="0" class="mt-4">
      <v-list-item> <h1>Filters</h1></v-list-item>
      <v-list-item>
        <v-select
          class="ma-2"
          label="Category"
          density="compact"
          variant="plain"
          multiple
          @click="loadCategories"
          :items="categories"
          item-title="name"
          item-value="id"
          :loading="loader.loaderMap['category']"
          v-model="categoryQuery"
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
          <v-text-field
            v-model="searchQuery"
            label="Search"
            variant="solo"
            density="comfortable"
            hide-details
            @keyup.enter="loadCoursesWithPageDrop"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-btn
            block
            prepend-icon="mdi-magnify"
            class="fill-height"
            variant="tonal"
            color="primary"
            :readonly="!searchQuery.length"
            @click="loadCoursesWithPageDrop"
          >
            Search
          </v-btn>
        </v-col>
      </v-row>
      <v-row
        v-if="loader.loaderMap['coursePage']"
        class="fill-height"
        justify="center"
        align="center"
      >
        <v-col class="d-flex flex-column" cols="1">
          <div>
            <v-progress-circular indeterminate size="50" />
          </div>
        </v-col>
      </v-row>

      <v-row v-else>
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
      <v-row justify="center">
        <v-col cols="6">
          <v-pagination
            v-if="showPaginator"
            :length="Math.ceil(count / pageSize)"
            v-model="currentPage"
          ></v-pagination>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
