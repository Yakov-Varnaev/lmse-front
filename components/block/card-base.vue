<script>
export default {
  emits: ["edit", "delete", "up", "down"],
  props: {
    id: { type: String, required: false },
    isLast: { type: Boolean, required: true },
    isFirst: { type: Boolean, required: true },
    editMode: { type: Boolean, required: true },
  },
};
</script>

<template>
  <v-hover>
    <template #default="{ isHovering, props }">
      <v-card
        v-bind="props"
        :variant="editMode ? 'outlined' : 'text'"
        class="border-dashed"
        elevation="0"
        :id="id"
      >
        <div
          v-if="isHovering && editMode"
          class="position-absolute right-0 mt-2 mr-2"
        >
          <v-btn
            @click.stop="$emit('edit')"
            icon="mdi-pencil"
            variant="flat"
            size="small"
            class="ml-1"
          />
          <v-btn
            @click.stop="$emit('delete')"
            icon="mdi-delete-outline"
            variant="flat"
            size="small"
            class="ml-1"
          />
          <v-btn
            @click.stop="$emit('up')"
            :disabled="isFirst"
            icon="mdi-arrow-up"
            variant="flat"
            size="small"
            class="ml-1"
          />
          <v-btn
            @click.stop="$emit('down')"
            :disabled="isLast"
            icon="mdi-arrow-down"
            variant="flat"
            size="small"
            class="ml-1"
          />
        </div>
        <slot />
      </v-card>
    </template>
  </v-hover>
</template>
