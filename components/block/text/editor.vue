<script lang="ts" setup>
import { defineProps, defineEmits, reactive } from "vue";
import type { Block, TextBlockMeta } from "~/types";

const props = defineProps<{
  block: Block<TextBlockMeta>;
}>();

const emit = defineEmits<{
  (e: "update", data: TextBlockMeta): void;
  (e: "cancel"): void;
}>();

const data = reactive({ ...props.block.meta });

function submit() {
  emit("update", data);
}
</script>

<template>
  <v-card>
    <VuetifyTiptap
      v-model.trim="data.content"
      max-height="700"
      class="editor bg-background"
      markdown-theme="github"
    />
    <v-card-actions>
      <ButtonBlock @cancel="$emit('cancel')" @submit="submit" />
    </v-card-actions>
  </v-card>
</template>
