<script>
export default {
  emits: ["edit", "delete"],
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
        :max-height="minify ? 300 : null"
        v-bind="props"
        :variant="editMode ? 'outlined' : 'text'"
        class="border-dashed"
        elevation="0"
      >
        <div
          v-if="isHovering && editMode"
          class="position-absolute right-0 mt-2 mr-2"
        >
          <v-btn @click.stop="$emit('edit')" icon="mdi-pencil" variant="flat" />
          <v-btn
            @click.stop="$emit('delete')"
            icon="mdi-delete-outline"
            variant="flat"
          />
        </div>
        <v-card-text v-if="block.content && block.content !== '<p></p>'">
          <VuetifyViewer :value="block.content" class="bg-background" />
        </v-card-text>
        <v-card-title v-else class="text-grey text-h4 font-weight-black">
          Add some text...
        </v-card-title>
      </v-card>
    </template>
  </v-hover>
</template>
