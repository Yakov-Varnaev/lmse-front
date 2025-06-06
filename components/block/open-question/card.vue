<script setup lang="ts">
import type { Block, OpenQuestionBlockMeta } from "~/types";

const emit = defineEmits(["edit", "delete", "up", "down"]);
const { block } = defineProps<{
  block: Block<OpenQuestionBlockMeta>;
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
} = useBlockCard<{ text: string }, Object>({
  block: block,
  initialAnswerData: () => ({ text: "" }),
});
const hasText = computed((): boolean => {
  return block.meta.text.length > 0 && block.meta.text !== "<p></p>";
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
    :has-answer="!!answerData.text.length"
    :block="block"
    @answer="processAnswer"
    @reset="reset"
    @up="$emit('up')"
    @down="$emit('down')"
    @edit="$emit('edit')"
    @delete="$emit('delete')"
  >
    <v-card-title v-if="!hasText" class="text-grey text-h4 font-weight-black">
      Open Question
    </v-card-title>

    <v-card-text>
      <VuetifyViewer
        v-if="hasText"
        :value="block.meta.text"
        class="bg-background"
      />

      <v-text-field
        v-if="!answerGiven"
        :disabled="editMode"
        v-model.trim="answerData.text"
        :value="
          editMode ? block.meta.answer.text || 'Add answer...' : answerData.text
        "
      />
      <v-card
        v-else
        class="mb-5"
        :variant="!answerGiven ? 'text' : 'tonal'"
        :color="answerGiven ? (isCorrect ? 'success' : 'error') : ''"
      >
        <v-card-text>
          {{ answerData.text }}
        </v-card-text>
      </v-card>
    </v-card-text>
  </BlockCardBase>
</template>
