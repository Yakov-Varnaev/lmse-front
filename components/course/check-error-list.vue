<script setup lang="ts">
defineProps<{ errors: { code: string }[] }>();

const errCodeMap = {
  "course.error.short.short-description": {
    en: "Course short description is too short!",
  },
  "course.error.short.description": { en: "Course description is too short!" },
  "course.error.no.chapters": { en: "Course must have at least one chapter!" },
  "chapter.error.short.description": {
    en: "Chapter description is too short!",
  },
  "chapter.error.no.lessons": { en: "Chapter must have at least one lesson!" },
  "lesson.error.no.blocks": { en: "Lesson must have at least one block!" },
  "block.text.empty": { en: "Block has no text!" },
  "block.answer.empty": {
    en: "Block must have some answer!",
  },
  "block.content.empty": {
    en: "Block content is empty",
  },
  "block.content.invalid": { en: "Block content is invalid" },
  "block.ordering.options.empty": {
    en: "Ordering block must have at least one option!",
  },
  "block.ordering.option.text.empty": {
    en: "Ordering block option has empty text",
  },
  "block.question.variants.empty": {
    en: "Must have variants to chose from!",
  },
  "block.question.variant.text.empty": {
    en: "Question block variant text is empty",
  },
  "block.question.variants.no.correct": {
    en: "Question block must have at least 1 correct answer!",
  },
  "block.connection.variant.text.empty": {
    en: "Connection block variant has empty text",
  },
};
</script>

<template>
  <v-list>
    <v-list-item
      v-for="err in errors"
      prepend-icon="mdi-alert-circle"
      class="text-error"
    >
      {{ err.code in errCodeMap ? errCodeMap[err.code]["en"] : err.code }}
    </v-list-item>
  </v-list>
</template>
