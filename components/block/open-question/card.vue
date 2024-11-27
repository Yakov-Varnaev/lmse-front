<script setup lang="ts">
import type { Block } from "~/types";

const emit = defineEmits(["edit", "delete", "up", "down"]);
const props = defineProps<{
  block: Block;
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
} = useBlockCard<{ text: string }>({
  block: props.block,
  initialAnswerData: () => ({ text: "" }),
});
const hasText = computed((): boolean => {
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
          editMode
            ? props.block.meta.answer.text || 'Add answer...'
            : answerData.text
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
    <v-card-actions v-if="!editMode">
      <v-btn
        v-if="!answerGiven"
        :disabled="!answerData.text"
        :loading="isAnswerLoading"
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
          <v-btn class="ml-2" plain prepend-icon="mdi-reload" @click="reset">
            Try Again
          </v-btn>
        </div>
      </v-row>
    </v-card-actions>
  </BlockCardBase>
</template>
