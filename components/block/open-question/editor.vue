<script setup lang="ts">
import type { Block, OpenQuestionBlockMeta } from "~/types";

const emits = defineEmits(["update", "cancel"]);
const { block } = defineProps<{ block: Block<OpenQuestionBlockMeta> }>();
const data = reactive<Block<OpenQuestionBlockMeta>>(deepCopy(block));

const submit = () => {
  emits("update", data.meta);
};
</script>

<template>
  <v-card variant="outlined">
    <v-card-text>
      <VuetifyTiptap
        v-model.trim="data.meta.text"
        class="editor bg-background"
        markdown-theme="github"
      />

      <v-divider class="mt-4"></v-divider>

      <v-sheet class="rounded pa-2">
        <v-row no-gutters>
          <v-col>
            <v-checkbox
              label="Case Sensitive"
              v-model="data.meta.caseSensitive"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <v-checkbox
              label="Numeric"
              v-model="data.meta.isNumeric"
              disabled
            />
          </v-col>
        </v-row>

        <v-row no-gutters align="center" class="mt-3">
          <v-col>
            <v-text-field
              :hide-details="true"
              density="comfortable"
              v-model.trim="data.meta.answer.text"
            />
          </v-col>
        </v-row>
      </v-sheet>

      <v-divider class="mb-4"></v-divider>
    </v-card-text>
    <v-card-actions>
      <ButtonBlock @cancel="$emit('cancel')" @submit="submit" />
    </v-card-actions>
  </v-card>
</template>
