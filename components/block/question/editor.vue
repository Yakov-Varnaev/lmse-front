<script setup lang="ts">
import type { Block } from "~/types";

const alert = useAlert();
const emit = defineEmits(["update", "cancel"]);
const props = defineProps<{ block: Block<any> }>();
const data = reactive({ ...props.block });

const submit = () => {
  emit("update", data.meta);
};

const addVariant = () => {
  if (data.meta.variants.length >= 10) {
    alert.reportError("Maximum amount of variants achived!");
    return;
  }
  let id = data.meta.variants.length;
  data.meta.variants.push({ id, text: "", correct: false });
};

const deleteVariant = (idx: number) => {
  data.meta.variants.splice(idx, 1);
  data.meta.variants.map((v: { id: number }, i: number): number => (v.id = i));
};

const getImageId = (id: number): string => {
  return `${props.block.id}-${id}-image`;
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
        <v-row
          no-gutters
          v-for="(variant, idx) in data.meta.variants"
          align="center"
          class="mt-3"
        >
          <v-col class="d-flex" cols="1">
            <v-checkbox class="mx-auto d-flex" v-model="variant.correct" />
          </v-col>

          <v-col>
            <BlockEditorTextImageField
              :id="getImageId(variant.id)"
              :variant="variant"
              :block="block"
            />
          </v-col>
          <v-col class="d-flex" cols="1">
            <v-btn
              icon="mdi-delete-outline"
              class="mx-auto"
              variant="text"
              @click="() => deleteVariant(idx)"
            >
            </v-btn>
          </v-col>
        </v-row>
        <v-row no-gutters class="mt-2">
          <v-col>
            <v-btn @click="addVariant" block variant="tonal" color="primary">
              Add variant
            </v-btn>
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

<style lang="scss">
.image-input {
  position: absolute;
  visibility: hidden;
}
</style>
