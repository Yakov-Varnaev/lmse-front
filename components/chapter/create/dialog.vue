<script>
export default {
  props: {
    courseId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen;
    },
    created(newChapter) {
      this.$emit("created", newChapter);
      this.toggle();
    },
  },
};
</script>
<template>
  <v-dialog v-model="isOpen" max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
      <slot name="activator" :props="activatorProps" />
    </template>
    <template v-slot:default="{ isActive }">
      <ChapterCreateForm
        @cancel="toggle"
        @created="created"
        :course-id="courseId"
      />
    </template>
  </v-dialog>
</template>
