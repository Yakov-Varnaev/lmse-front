<script setup lang="ts">
defineProps<{
  courseId: string;
}>();

const emit = defineEmits(["created", "close"]);

const created = (newChapter: { title: string }): void => {
  emit("created", newChapter);
  emit("close");
};
</script>

<template>
  <v-dialog max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
      <slot name="activator" :props="activatorProps" />
    </template>
    <template v-slot:default="{ isActive }">
      <ChapterCreateForm
        @cancel="$emit('close')"
        @created="created"
        :course-id="courseId"
      />
    </template>
  </v-dialog>
</template>
