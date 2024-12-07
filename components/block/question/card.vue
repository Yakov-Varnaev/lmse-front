<script setup lang="ts">
import type { Block } from "~/types";

const emits = defineEmits(["edit", "delete", "up", "down"]);
const props = defineProps<{
  block: Block<{
    text: string;
    variants: {
      id: number;
      correct: boolean;
      text?: string;
      image?: { src: string; id: string };
    }[];
  }>;
  editMode: boolean;
  isLast: boolean;
  isFirst: boolean;
}>();

const {
  answerGiven,
  isCorrect,
  isAnswerLoading,
  processAnswer,
  answerData,
  reset,
} = useBlockCard<{ variants: number[] }, Object>({
  block: props.block,
  initialAnswerData: () => ({ variants: [] }),
});

const selectVariant = (id: number): void => {
  if (answerData.variants.includes(id)) {
    const idx = answerData.variants.indexOf(id);
    answerData.variants.splice(idx, 1);
  } else {
    answerData.variants.push(id);
  }
};

const isSelected = (id: number): boolean => {
  return answerData.variants.includes(id);
};

const hasText = computed(() => {
  return (
    props.block.meta.text.length > 0 && props.block.meta.text !== "<p></p>"
  );
});
</script>

<template>
  <BlockCardBase
    :edit-mode="editMode"
    :isFirst="isFirst"
    :isLast="isLast"
    @up="$emit('up')"
    @down="$emit('down')"
    @edit="$emit('edit')"
    @delete="$emit('delete')"
  >
    <v-card-title v-if="!hasText" class="text-grey text-h4 font-weight-black">
      Question with Variants
    </v-card-title>

    <v-card-text>
      <VuetifyViewer
        v-if="hasText"
        :value="block.meta.text"
        class="bg-background"
      />
      <v-row class="variant-box" justify="center" align="center">
        <v-col
          v-for="variant in block.meta.variants"
          :cols="variant.image ? 6 : 12"
        >
          <block-question-variant
            :key="variant.id"
            :variant="variant"
            :selected="isSelected(variant.id)"
            :readonly="editMode || answerGiven"
            :answerCorrect="isCorrect"
            :answerGiven="answerGiven"
            @click="() => selectVariant(variant.id)"
          >
          </block-question-variant>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions v-if="!editMode">
      <v-btn
        v-if="!answerGiven"
        :loading="isAnswerLoading"
        :disabled="!answerData.variants.length"
        color="success"
        variant="tonal"
        block
        @click="processAnswer"
      >
        Answer
      </v-btn>
      <v-row no-gutters justify="center">
        <div class="d-flex align-center">
          <span
            :class="{
              'text-h5': true,
              'text-success': isCorrect,
              'text-error': !isCorrect,
            }"
          >
            {{ isCorrect ? "Correct!" : "Wrong!" }}
          </span>
          <v-btn
            v-if="!isCorrect"
            class="ml-2"
            plain
            prepend-icon="mdi-reload"
            @click="reset"
          >
            Try Again
          </v-btn>
        </div>
      </v-row>
    </v-card-actions>
  </BlockCardBase>
</template>

<style lang="scss"></style>
