<script>
export default {
  emits: ["openEdit"],
  props: {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  setup() {
    return { auth: useAuth() };
  },
};
</script>

<template>
  <v-card elevation="0">
    <v-card-title>
      <div class="d-flex align-center">
        <div class="course-title">
          {{ title }}
        </div>
      </div>
    </v-card-title>
    <v-card-text>
      <VuetifyViewer :value="content" class="bg-background" />
    </v-card-text>
  </v-card>
</template>

<style scoped>
.course-title {
  font-size: 4vw;
}
</style>
