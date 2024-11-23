<script>
export default {
  setup() {
    definePageMeta({
      name: "course-editor",
      middleware: "authenticated",
      extra: { obj: "course", field: "courseId" },
    });

    return {};
  },
};
</script>

<template>
  <CourseEditor :course-id="$route.params.id" />
</template>
