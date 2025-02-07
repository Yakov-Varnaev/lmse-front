<script setup lang="ts">
definePageMeta({
  layout: "centered",
});

const cnt = ref(0);
</script>

<template>
  <div>
    <h1>LMSE</h1>
    <p>the only LMS engine you need.</p>
    <v-btn @click="cnt++">count: {{ cnt }}</v-btn>
  </div>
</template>
