<script setup>
definePageMeta({
  name: "course-detail",
  middleware: "authenticated",
});
</script>

<template>
  <CourseDetail :course-id="$route.params.id" />
</template>
