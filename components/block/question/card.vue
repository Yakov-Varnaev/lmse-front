<script setup lang="ts">
import type { Block } from "~/types";

const emits = defineEmits(["edit", "delete", "up", "down"]);
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
} = useBlockCard<{ variants: Number[] }>({
  block: props.block,
  initialAnswerData: () => ({ variants: [] }),
});

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
      <v-card
        v-for="variant in block.meta.variants"
        :key="variant.id"
        class="fill-width pa-0 mt-1 opacity-1"
        :variant="answerGiven ? 'tonal' : undefined"
        :color="answerGiven ? (variant.correct ? 'success' : 'error') : ''"
        :disabled="editMode"
      >
        <v-checkbox
          class="mx-1"
          hide-details
          :disabled="editMode"
          :readonly="answerGiven"
          :label="variant.text"
          v-model="answerData.variants"
          :value="variant.id"
          :key="variant.id"
        >
          <template #label>
            <span class="text-dark ml-1">{{ variant.text }}</span>
          </template>
        </v-checkbox>
      </v-card>
    </v-card-text>
    <v-card-actions v-if="!editMode">
      <v-btn
        v-if="!answerGiven"
        :loading="isAnswerLoading"
        :disabled="!hasText"
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
