<script>
export default {
  emits: ["edit", "delete", "up", "down"],
  props: {
    block: { type: Object, required: true },
    editMode: { type: Boolean, required: true },
    isLast: { type: Boolean, required: true },
    isFirst: { type: Boolean, required: true },
  },
};
</script>

<template>
  <BlockCardBase
    :edit-mode="editMode"
    :isFirst="isFirst"
    :isLast="isLast"
    :hide-bottom="true"
    @up="$emit('up')"
    @down="$emit('down')"
    @edit="$emit('edit')"
    @delete="$emit('delete')"
  >
    <v-card-text v-if="block.content && block.content !== '<p></p>'">
      <VuetifyViewer :value="block.content" class="bg-background" />
    </v-card-text>
    <v-card-title v-else class="text-grey text-h4 font-weight-black">
      Text
    </v-card-title>
  </BlockCardBase>
</template>
