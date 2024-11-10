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
  <v-hover>
    <template v-slot:default="{ isHovering, props }">
      <v-card elevation="0" v-bind="props">
        <v-card-title>
          <div class="d-flex align-center">
            <div class="course-title">
              {{ title }}
            </div>
            <v-btn
              class="ml-auto"
              label
              v-if="isHovering"
              @click="$emit('openEdit')"
            >
              Click to edit
            </v-btn>
          </div>
        </v-card-title>
        <v-card-text>
          <VuetifyViewer :value="content" class="bg-background" />
        </v-card-text>
      </v-card>
    </template>
  </v-hover>
</template>

<style scoped>
.course-title {
  font-size: 4vw;
}
</style>
