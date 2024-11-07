<script setup>
definePageMeta({
  name: "profile",
  middleware: "authenticated",
  crumb: "Profile",
});
</script>

<template>
  <div>
    <ProfileCard :user-id="$route.params.id" />
    <v-container>
      <v-col md="8" offset-md="2">
        <CourseProfile :userId="$route.params.id" />
      </v-col>
    </v-container>
  </div>
</template>
