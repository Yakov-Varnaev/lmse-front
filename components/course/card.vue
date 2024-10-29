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
  <v-card>
    <v-card-title>
      {{ course.name }}
    </v-card-title>
  </v-card>
</template>
