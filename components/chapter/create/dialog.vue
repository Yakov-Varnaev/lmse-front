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
  <v-dialog v-model="isOpen">
    <template v-slot:activator="{ props: activatorProps }">
      <slot name="activator" :props="activatorProps" />
    </template>
    <v-container>
      <v-col md="6" offset-md="3">
        <ChapterCreateForm
          @cancel="toggle"
          @created="created"
          :course-id="courseId"
        />
      </v-col>
    </v-container>
  </v-dialog>
</template>
