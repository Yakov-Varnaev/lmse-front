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
        <div class="d-flex justify-space-between mb-2 pa-2 bg-primary rounded">
          <h1>Courses</h1>
          <CourseCreateOverlay />
        </div>
        <CourseList my="true" />
      </v-col>
    </v-container>
  </div>
</template>
