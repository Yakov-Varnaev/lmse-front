<script>
export default {
  props: {
    course: {
      type: Object,
      required: true,
    },
  },
};
</script>

<template>
  <v-card elevation="0">
    <v-card-title>
      {{ course.name }}
    </v-card-title>
  </v-card>
</template>
