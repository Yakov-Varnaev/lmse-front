<script>
export default {
  data() {
    return {
      courseOverlay: false,
    };
  },
  methods: {
    closeOverlay() {
      this.courseOverlay = false;
    },
    openOverlay() {
      this.courseOverlay = true;
    },
    created(data) {
      this.$emit("append", data);
      this.closeOverlay();
    },
  },
};
</script>

<template>
  <v-dialog v-model="courseOverlay">
    <template v-slot:activator="{ props }">
      <v-btn variant="plain" icon v-bind="props">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>

    <v-container>
      <v-row>
        <v-col md="4" offset-md="4">
          <CourseCreateForm @cancel="closeOverlay" @created="created" />
        </v-col>
      </v-row>
    </v-container>
  </v-dialog>
</template>
