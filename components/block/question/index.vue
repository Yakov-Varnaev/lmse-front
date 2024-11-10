<script>
export default {
  emits: ["update"],
  props: {
    courseId: { type: String, required: true },
    chapterId: { type: String, required: true },
    lessonId: { type: String, required: true },
    block: {
      type: Object,
      required: true,
    },
  },
};
</script>

<template>
  <BlockQuestionCard :block="block.meta" />
</template>
