<script setup lang="ts">
import type { Block, OrderingBlockMeta } from "~/types";

const emits = defineEmits(["edit", "delete", "up", "down"]);
const props = defineProps<{
  block: Block<OrderingBlockMeta>;
  editMode: boolean;
  isLast: boolean;
  isFirst: boolean;
}>();
type variant = {
  id: number;
  text: string;
};

const {
  answerGiven,
  isCorrect,
  isAnswerLoading,
  processAnswer,
  answerData,
  reset: blockReset,
} = useBlockCard<{ order: variant[] }, { correct: boolean[] }>(
  {
    block: props.block,
    initialAnswerData: (): { order: variant[] } => ({ order: [] }),
  },
  {
    answerProcessor: {
      to: (answer: { order: variant[] }) => ({
        order: answer.order.map((o) => o.id),
      }),
      from: (answer: any): { order: variant[] } => {
        let m: Map<number, variant> = new Map();
        for (const opt of props.block.meta.options) {
          m.set(opt.id, opt);
        }
        return { order: answer.order.map((i: number): variant => m.get(i)!) };
      },
    },
  },
);

const getCorrectnessArr = (): boolean[] => {
  var failed = false;
  return props.block.meta.options.map((opt: variant, i: number) => {
    let correct = opt.text == answerData.order[i].text;
    if (!correct) {
      failed = true;
    } else {
      if (failed && props.block.meta.failOnFirst) {
        return false;
      }
    }
    return correct;
  });
};

const correctnessArr = computed<boolean[]>(() => {
  return answerGiven.value ? getCorrectnessArr() : [];
});

const drag = ref(false);
const options = ref(
  answerGiven.value
    ? []
    : !props.editMode
      ? shuffleArray(props.block.meta.options)
      : props.block.meta.options,
);

const reset = () => {
  blockReset();
  options.value = shuffleArray(props.block.meta.options);
};

watch(drag, () => {
  if (!answerGiven.value) return;
  answerGiven.value = false;
  isCorrect.value = false;
  // .value = [];
});

const groupName = crypto.randomUUID();

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
    :is-answer-loading="isAnswerLoading"
    :answer-given="answerGiven"
    :is-correct="isCorrect"
    :has-answer="answerData.order.length === block.meta.options.length"
    :block="block"
    @answer="processAnswer"
    @reset="reset"
    @up="$emit('up')"
    @down="$emit('down')"
    @edit="$emit('edit')"
    @delete="$emit('delete')"
  >
    <v-card-title v-if="!hasText" class="text-grey text-h4 font-weight-black">
      Ordering Puzzle
    </v-card-title>

    <v-card-text>
      <VuetifyViewer
        v-if="hasText"
        :value="block.meta.text"
        class="bg-background"
        style="min-height: 50px"
      />
      <v-card class="rounded d-flex flex-wrap" variant="tonal" min-height="50">
        <draggable
          style="min-height: 50; width: 100%"
          @start="drag = true"
          @end="drag = false"
          animation="200"
          :group="groupName"
          v-model="options"
          item-key="id"
          :disabled="editMode"
        >
          <template v-slot:item="{ element: option }">
            <v-chip
              :text="option.text"
              :key="option.id"
              label
              :class="{
                'ma-2': true,
                'cursor-grab': !drag,
                'cursor-grabbing': drag,
              }"
            />
          </template>
        </draggable>
      </v-card>

      <v-divider class="my-4"></v-divider>

      <v-card
        class="rounded d-flex flex-wrap"
        min-height="50"
        variant="tonal"
        :color="!answerGiven ? 'primary' : isCorrect ? 'success' : 'primary'"
      >
        <v-tooltip
          activator="parent"
          location="top"
          v-if="!answerData.order.length && !editMode"
        >
          Drag items from above
        </v-tooltip>
        <draggable
          style="min-height: 50; width: 100%"
          class=""
          @start="drag = true"
          @end="drag = false"
          :group="groupName"
          animation="200"
          v-model="answerData.order"
          item-key="id"
          :disabled="editMode || (answerGiven && isCorrect)"
        >
          <template v-slot:item="{ element: option, index }">
            <v-chip
              :text="option.text"
              :key="option.id"
              :color="
                answerGiven ? (correctnessArr[index] ? 'success' : 'red') : ''
              "
              label
              :class="{
                'ma-2': true,
                'cursor-grab': !drag,
                'cursor-grabbing': drag,
              }"
            />
          </template>
        </draggable>
      </v-card>
    </v-card-text>
  </BlockCardBase>
</template>
