<script setup lang="ts">
definePageMeta({
  layout: "centered",
  middleware: "anon-only",
  crumb: "Signup",
});
</script>

<template>
  <v-col md="4">
    <signup-card />
  </v-col>
</template>
