<script setup>
definePageMeta({
  name: "profile",
  middleware: "authenticated",
  crumb: "Profile",
});
</script>

<template>
  <v-container>
    <v-col lg="8" offset-lg="2" xl="6" offset-xl="3">
      <ProfileCard :user-id="$route.params.id" />
      <CourseProfile :userId="$route.params.id" />
    </v-col>
  </v-container>
</template>
