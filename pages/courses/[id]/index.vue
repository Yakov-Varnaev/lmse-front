<script>
export default {
  setup() {
    definePageMeta({
      name: "courses-detail",
      middleware: "authenticated",
      extra: { obj: "course", field: "courseId" },
    });

    return {};
  },
};
</script>

<template>
  <CourseDetail :course-id="$route.params.id" />
</template>
