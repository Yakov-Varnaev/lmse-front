<script setup>
definePageMeta({
  name: "lesson-detail",
  middleware: "authenticated",
  extra: { obj: "lesson", field: "lessonId" },
});
</script>

<template>
  <LessonDetail
    :course-id="$route.params.id"
    :chapter-id="$route.params.chapterId"
    :lesson-id="$route.params.lessonId"
  />
</template>
