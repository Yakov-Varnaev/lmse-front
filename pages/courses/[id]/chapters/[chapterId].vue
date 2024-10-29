<script setup>
definePageMeta({
  name: "chapters",
  middleware: "authenticated",
  extra: { obj: "chapter", field: "chapterId" },
});
</script>

<template>
  <v-container>
    <v-navigation-drawer>
      <v-list-item>Themes</v-list-item>
      <v-divider />
    </v-navigation-drawer>
    <ChapterDetail
      :course-id="$route.params.id"
      :chapter-id="$route.params.chapterId"
    />
  </v-container>
</template>
