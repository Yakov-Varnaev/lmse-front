<script setup lang="ts">
defineProps({
  absolute: { type: Boolean, default: false },
});

const mode = useMode();
const context = useCourseContext();
</script>

<template>
  <div v-if="context.isOwner">
    <v-btn v-if="!absolute" v-bind="$attrs" @click="mode.toggle_edit">
      {{ mode.edit ? "Normal Mode" : "Edit Mode" }}
    </v-btn>
    <v-fab
      :prepend-icon="
        mode.edit ? 'mdi-toggle-switch' : 'mdi-toggle-switch-off-outline'
      "
      app
      location="bottom left"
      class="me-4 ml-7"
      v-else
      extended
      @click="mode.toggle_edit"
    >
      {{ mode.edit ? "View Mode" : "Edit Mode" }}
    </v-fab>
  </div>
</template>

<style lang="scss"></style>
