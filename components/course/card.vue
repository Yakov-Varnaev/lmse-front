<script>
export default {
  emits: ["openEdit"],
  props: {
    course: {
      type: Object,
      required: true,
    },
  },
  setup() {
    return { auth: useAuth() };
  },
  data() {
    return {
      courseData: { ...this.$props.course },
    };
  },
  methods: {
    courseUpdated(data) {
      this.$emit("updated", data);
    },
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
              {{ courseData.title }}
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
          <VuetifyViewer
            :value="courseData.description"
            class="bg-background"
          />
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
