<script setup lang="ts">
import { getCategories } from "~/api/courses";

const loader = useLoader();

const categories = ref<any[]>([]);

const loadCategories = async () => {
  loader.withKeyLoader("category", async () => {
    if (categories.value.length) return;
    const { data } = await getCategories();
    categories.value = data;
  });
};

onMounted(async () => {
  await loadCategories();
});
</script>

<template>
  <v-select
    label="Category"
    variant="plain"
    @click="loadCategories"
    :items="categories"
    item-title="name"
    item-value="id"
    :loading="loader.loaderMap['category']"
    elevation="0"
    v-bind="$attrs"
  />
</template>
