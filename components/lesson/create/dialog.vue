<script>
export default {
  emits: ["close", "created"],
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
    created(newLesson) {
      this.$emit("created", newLesson);
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
