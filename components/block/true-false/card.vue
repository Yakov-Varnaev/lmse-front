<script setup lang="ts">
import type { Block, TrueFalseBlockMeta } from "~/types";

const emits = defineEmits(["edit", "delete", "up", "down"]);
const { block } = defineProps<{
  block: Block<TrueFalseBlockMeta>;
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
} = useBlockCard<{ statements: { id: number; value?: string }[] }, Object>({
  block: block,
  initialAnswerData: () => ({
    statements: [
      ...block.meta.statements.map((s) => ({
        id: s.id,
      })),
    ],
  }),
});

const getColor = (idx: number): string => {
  if (!answerGiven.value) return "";
  return block.meta.statements[idx].value === answerData.statements[idx].value
    ? "success"
    : "error";
};

const hasText = computed(() => {
  return block.meta.text.length > 0 && block.meta.text !== "<p></p>";
});

const hasAnaswer = computed(() => {
  return answerData.statements.every((s) => s.value !== undefined);
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
    :has-answer="hasAnaswer"
    @answer="processAnswer"
    @reset="reset"
    @up="$emit('up')"
    @down="$emit('down')"
    @edit="$emit('edit')"
    @delete="$emit('delete')"
  >
    <v-card-title v-if="!hasText" class="text-grey text-h4 font-weight-black">
      True/False Block
    </v-card-title>
    <v-card-text>
      <VuetifyViewer
        v-if="hasText"
        :value="block.meta.text"
        class="bg-background"
      />
      <v-divider class="mb-3" />
      <v-row v-for="(statement, idx) in block.meta.statements">
        <v-col cols="1">
          <v-icon icon="mdi-minus-thick" />
        </v-col>
        <v-col>
          {{ statement.text }}
        </v-col>
        <v-col cols="3">
          <BlockTrueFalseSelector
            @update:modelValue="
              (v: string) => {
                answerData.statements[idx].value = v;
              }
            "
            :allow-unknown="block.meta.allowUnknown"
            :bg-color="getColor(idx)"
            :model-value="
              editMode
                ? block.meta.statements[idx].value
                : answerData.statements[idx].value
            "
            :readonly="answerGiven || editMode"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </BlockCardBase>
</template>
