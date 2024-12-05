<script setup lang="ts">
const bread = useBreadcrumbs();
const loader = useLoader();

const isLoading = computed(() => {
  return !!loader.loaderMap["braed"];
});

const crumbs = computed((): Partial<Crumb>[] => {
  let route = useRoute();
  let router = useRouter();
  const r = router.resolve(route.fullPath);
  let smartCrumb = false;
  if (
    r.name &&
    [
      "course-detail",
      "course-editor",
      "chapter-detail",
      "lesson-detail",
    ].includes(r.name)
  ) {
    smartCrumb = true;
  }

  if (!smartCrumb) {
    return [
      {
        title: "LMSE",
      },
    ];
  }
  return bread.crumbs.length ? bread.crumbs : [{ title: "LMSE" }];
});
</script>

<template>
  <v-chip color="primary">
    <v-breadcrumbs v-if="!isLoading" :items="crumbs" />
    <span v-else>loading</span>
  </v-chip>
</template>
