<script setup lang="ts">
definePageMeta({
  layout: "centered",
  crumb: "Signup",
});
</script>

<template>
  <v-col cols="6">
    <BlockConnectionCard :block="{}" :minify="false" :edit-mode="false" />
  </v-col>
</template>
