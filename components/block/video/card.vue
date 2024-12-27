<script setup lang="ts">
import type { Block, VideoBlockMeta } from "~/types";

const emit = defineEmits(["edit", "delete", "up", "down"]);

defineProps<{
  block: Block<VideoBlockMeta>;
  editMode: boolean;
  isLast: boolean;
  isFirst: boolean;
}>();
</script>

<template>
  <BlockCardBase
    :edit-mode="editMode"
    :isFirst="isFirst"
    :isLast="isLast"
    :hide-bottom="true"
    :block="block"
    @up="$emit('up')"
    @down="$emit('down')"
    @edit="$emit('edit')"
    @delete="$emit('delete')"
  >
    <v-card-text>
      <VideoPlayer :src="block.meta.video?.src" />
      <p>{{ block.meta.title }}</p>
    </v-card-text>
  </BlockCardBase>
</template>

<style lang="scss"></style>
