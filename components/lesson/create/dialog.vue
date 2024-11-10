<script>
export default {
  props: {
    courseId: {
      type: String,
      required: true,
    },
    chapterId: {
      type: String,
      required: true,
    },
  },
  methods: {
    created(newChapter) {
      this.$emit("created", newChapter);
    },
  },
};
</script>
<template>
  <v-dialog v-bind="$attrs" max-width="500">
    <template v-slot:default>
      <LessonCreateForm
        @cancel="$emit('close')"
        @created="created"
        :course-id="courseId"
        :chapter-id="chapterId"
      />
    </template>
  </v-dialog>
</template>
