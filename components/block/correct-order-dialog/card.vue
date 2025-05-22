<script setup lang="ts">
import { VuetifyViewer } from "vuetify-pro-tiptap";
import type {
  Block,
  CorrectOrderDialogBlockMeta,
  CorrectOrderDialogOption,
} from "~/types";

const emits = defineEmits(["edit", "delete", "up", "down"]);
const { editMode, block } = defineProps<{
  block: Block<CorrectOrderDialogBlockMeta>;
  editMode: boolean;
  isLast: boolean;
  isFirst: boolean;
}>();

const drag = ref(false);

const {
  answerGiven,
  isCorrect,
  isAnswerLoading,
  processAnswer,
  answerData,
  answerExtra,
  reset: blockReset,
} = useBlockCard<{ order: CorrectOrderDialogOption[] }, any>(
  {
    block: block,
    initialAnswerData: () => ({ order: [] }),
  },
  {
    answerProcessor: {
      to: (answer: { order: CorrectOrderDialogOption[] }) => ({
        order: answer.order.map((msg) => msg.id),
      }),
      from: (answer: any): { order: CorrectOrderDialogOption[] } => {
        let m: Map<string, CorrectOrderDialogOption> = new Map();
        for (const opt of block.meta.options) {
          m.set(opt.id, opt);
        }
        return {
          order: answer.order.map(
            (id: string): CorrectOrderDialogOption => m.get(id)!,
          ),
        };
      },
    },
  },
);

const options = ref(
  answerGiven.value
    ? []
    : !editMode
      ? shuffleArray(block.meta.options)
      : block.meta.options,
);

const reset = () => {
  blockReset();
  options.value = shuffleArray(block.meta.options);
};

watch(drag, () => {
  if (!answerGiven.value) return;
  answerGiven.value = false;
  isCorrect.value = false;
});

const hasAnswer = computed<boolean>(() => {
  return answerData.order.length === block.meta.options.length;
});

const groupName = crypto.randomUUID();
</script>

<template>
  <BlockCardBase
    :edit-mode="editMode"
    :isFirst="isFirst"
    :isLast="isLast"
    :is-answer-loading="isAnswerLoading"
    :answer-given="answerGiven"
    :is-correct="isCorrect"
    :has-answer="hasAnswer"
    :block="block"
    @answer="processAnswer"
    @reset="reset"
    @up="$emit('up')"
    @down="$emit('down')"
    @edit="$emit('edit')"
    @delete="$emit('delete')"
  >
    <v-card-text>
      <VuetifyViewer :value="block.meta.text" />
      <v-sheet class="ma-2 pa-2">
        <v-card
          variant="outlined"
          color="primary"
          min-height="200"
          width="100%"
          class="my-2 pa-2"
        >
          <draggable
            style="min-height: 200px; width: 100%"
            @start="drag = true"
            @end="drag = false"
            animation="200"
            :group="groupName"
            v-model="answerData.order"
            item-key="id"
            :disabled="editMode"
          >
            <template v-slot:item="{ element: message }">
              <v-card
                fluid
                :class="{
                  'pa-2 my-1 rounded': true,
                  'ml-auto': message.right,
                }"
                border
                variant="tonal"
                color="primary"
                max-width="70%"
              >
                <div>
                  {{ message.sender }}
                </div>
                <p>{{ message.text }}</p>
              </v-card>
            </template>
          </draggable>
        </v-card>

        <v-divider></v-divider>

        <v-card
          variant="tonal"
          color="primary"
          min-width="100"
          class="pa-2 mt-2"
        >
          <draggable
            style="min-height: 100px"
            @start="drag = true"
            @end="drag = false"
            animation="200"
            :group="groupName"
            v-model="options"
            item-key="id"
            :disabled="editMode"
          >
            <template v-slot:item="{ element: message }">
              <v-sheet class="pa-2 my-1 rounded bg-primary" border>
                <div>
                  {{ message.sender }}
                </div>
                <p>{{ message.text }}</p>
              </v-sheet>
            </template>
          </draggable>
        </v-card>
      </v-sheet>
    </v-card-text>
  </BlockCardBase>
</template>
