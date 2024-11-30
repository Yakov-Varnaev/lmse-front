<script>
export default {
  mounted() {
    useAuth().startRefreshTask();
  },
};
</script>

<template>
  <v-app>
    <LmseAppBar app />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <AlertContainer />
  </v-app>
</template>
