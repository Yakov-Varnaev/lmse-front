<script setup>
const error = useError();
</script>

<template>
  <v-app>
    <LmseAppBar app />
    <NuxtLayout name="centered">
      <Error404 v-if="error.statusCode === 404" />
    </NuxtLayout>
  </v-app>
</template>
