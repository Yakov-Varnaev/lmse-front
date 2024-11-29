<script setup lang="ts">
const bread = useBreadcrumbs();

const crumbs = computed((): Partial<Crumb>[] => {
  let route = useRoute();
  let router = useRouter();
  const r = router.resolve(route.fullPath);
  let smartCrumb = false;
  if (
    r.name &&
    ["course-detail", "course-editor", "chapter-detail", "lessons"].includes(
      r.name,
    )
  ) {
    smartCrumb = true;
  }

  if (!smartCrumb) {
    return [{ title: "LMSE" }];
  }
  return bread.crumbs.length ? bread.crumbs : [{ title: "LMSE" }];
});
</script>

<template>
  <v-chip color="primary">
    <v-breadcrumbs :items="crumbs" />
  </v-chip>
</template>
