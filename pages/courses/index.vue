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

const getLevelColor = (level: string): string => {
  return {
    beginner: "success",
    medium: "warning",
    advanced: "purple",
  }[level]!;
};
</script>

<template>
  <div class="fill-height">
    <v-navigation-drawer border="0" class="mt-4">
      <v-list-item> <h1>Filters</h1></v-list-item>
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
        class="fill-width"
        justify="center"
        align="center"
      >
        <v-col class="d-flex flex-column" cols="1">
          <div>
            <v-progress-circular indeterminate size="50" />
          </div>
        </v-col>
      </v-row>

      <v-row v-else v-for="course in courses" :key="course.id">
        <v-col>
          <v-card
            variant="flat"
            :to="{ name: 'course-detail', params: { id: course.id } }"
            class="rounded-xl"
          >
            <v-row>
              <v-col xl="3" lg="3" cols="3" md="4">
                <div class="fill-width">
                  <v-img
                    v-if="course.image"
                    class="rounded-xl"
                    :src="course.image"
                    cover
                    width="100%"
                  />
                  <v-card
                    v-else
                    variant="tonal"
                    class="fill-height rounded-xl d-flex image-container"
                    color="primary"
                  >
                    <v-icon
                      icon="mdi-image-off-outline"
                      class="ma-auto"
                      size="150"
                    />
                  </v-card>
                </div>
              </v-col>
              <v-col>
                <div class="fill-width">
                  <v-card-title class="">
                    <v-chip
                      variant="outlined"
                      :color="getLevelColor(course.level)"
                      class="ma-1 text-capitalize float-right"
                    >
                      {{ course.level }}
                    </v-chip>
                    <v-chip
                      variant="outlined"
                      color="primary"
                      class="ma-1 float-right"
                      v-if="course.category"
                    >
                      {{ course.category.name }}
                    </v-chip>
                    <div>{{ course.title }}</div>
                  </v-card-title>
                  <div>
                    <v-chip
                      v-for="tag in course.tags"
                      class="ma-1"
                      :color="
                        getRandom([
                          'primary',
                          'warning',
                          'error',
                          'info',
                          'yellow',
                        ])
                      "
                    >
                      {{ tag }}
                    </v-chip>
                  </div>
                  <v-card-text class="short-description">
                    {{ course.shortDescription }}
                  </v-card-text>
                  <v-card-actions>
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
                </div>
              </v-col>
            </v-row>
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
