<script>
export default {
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
      editMode: false,
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
      <v-card elevation="0" v-bind="{ ...$attrs, ...props }" class="fill-width">
        <v-card-title>
          <div class="d-flex align-center">
            <div class="text-h2">
              {{ courseData.title }}
            </div>
            <v-chip class="ml-auto" label v-if="isHovering">
              Click to edit
            </v-chip>
          </div>
        </v-card-title>
        <v-card-text>
          <VuetifyViewer :value="courseData.description" />
        </v-card-text>
      </v-card>
    </template>
  </v-hover>
</template>
