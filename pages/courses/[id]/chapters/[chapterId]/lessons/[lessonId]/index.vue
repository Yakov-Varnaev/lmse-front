<script setup>
definePageMeta({
  name: "lessons",
  middleware: "authenticated",
  extra: { obj: "lesson", field: "lessonId" },
});
</script>

<template>Lesson</template>
