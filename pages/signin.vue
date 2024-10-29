<script setup lang="ts">
definePageMeta({
  layout: "centered",
  middleware: "anon-only",
  crumb: "signin",
});
</script>

<template>
  <v-col md="4">
    <signin-card />
  </v-col>
</template>
