<script setup>
definePageMeta({
  name: "chapter-detail",
  middleware: "authenticated",
  extra: { obj: "chapter", field: "chapterId" },
});
</script>

<template>
  <ChapterDetail
    :course-id="$route.params.id"
    :chapter-id="$route.params.chapterId"
  />
</template>
