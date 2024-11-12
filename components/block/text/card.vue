<script>
export default {
  emits: ["edit"],
  props: {
    block: { type: Object, required: true },
    minify: { type: Boolean, required: true },
    editMode: { type: Boolean, required: true },
  },
};
</script>
<template>
  <v-hover>
    <template #default="{ isHovering, props }">
      <v-card
        v-bind="props"
        :max-height="cardHeight"
        :variant="editMode ? 'outlined' : 'text'"
        class="border-dashed"
        elevation="0"
      >
        <v-btn
          v-if="isHovering && editMode"
          class="position-absolute right-0 mt-2 mr-2"
          @click.stop="$emit('edit')"
        >
          edit
        </v-btn>
        <v-card-text>
          <VuetifyViewer :value="block.content" class="bg-background" />
        </v-card-text>
      </v-card>
    </template>
  </v-hover>
</template>
