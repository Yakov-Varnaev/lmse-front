<script setup>
definePageMeta({
  name: "chapters",
  middleware: "authenticated",
  extra: { obj: "chapter", field: "chapterId" },
});
</script>

<script>
export default {};
</script>

<template>
  <ChapterDetail
    :course-id="$route.params.id"
    :chapter-id="$route.params.chapterId"
  />
</template>
