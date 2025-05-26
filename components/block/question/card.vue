<script setup lang="ts">
import type { Block, QuestionBlockMeta } from "~/types";

const emits = defineEmits(["edit", "delete", "up", "down"]);
const props = defineProps<{
  block: Block<QuestionBlockMeta>;
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
} = useBlockCard<{ variants: string[] }, Object>({
  block: props.block,
  initialAnswerData: () => ({ variants: [] }),
});

const selectVariant = (id: string): void => {
  if (answerData.variants.includes(id)) {
    const idx = answerData.variants.indexOf(id);
    answerData.variants.splice(idx, 1);
  } else {
    answerData.variants.push(id);
  }
};

const isSelected = (id: string): boolean => {
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
    :is-answer-loading="isAnswerLoading"
    :answer-given="answerGiven"
    :is-correct="isCorrect"
    :has-answer="!!answerData.variants.length"
    :block="block"
    @answer="processAnswer"
    @reset="reset"
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
  </BlockCardBase>
</template>

<style lang="scss"></style>
