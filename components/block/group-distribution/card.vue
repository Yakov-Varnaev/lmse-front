<script setup lang="ts">
import type {
  Block,
  GroupDistributionAnswer,
  GroupDistributionItem,
  GroupDistributionMeta,
} from "~/types";

const emits = defineEmits(["edit", "delete", "up", "down"]);
const props = defineProps<{
  block: Block<GroupDistributionMeta>;
  editMode: boolean;
  isLast: boolean;
  isFirst: boolean;
}>();

const drag = ref(false);

let ans: { [key: string]: GroupDistributionItem[] } = {};
for (const g of props.block.meta.groups) {
  ans[g.id] = [];
}

const {
  answerGiven,
  isCorrect,
  isAnswerLoading,
  processAnswer,
  answerData,
  answerExtra,
  reset: blockReset,
} = useBlockCard<
  GroupDistributionAnswer,
  { correctMap: { [key: string]: { [key: string]: boolean } } }
>(
  {
    block: props.block,
    initialAnswerData: () => ({ groups: { ...ans } }),
  },
  {
    answerProcessor: {
      to: (answer: any): GroupDistributionAnswer => {
        const processedAnswer = JSON.parse(JSON.stringify(answer));
        for (const [k, v] of Object.entries(processedAnswer.groups)) {
          processedAnswer.groups[k] = (v as GroupDistributionItem[]).map(
            (i) => i.id,
          );
        }
        return processedAnswer;
      },
      from: (v: any) => {
        let itemMap: { [key: string]: any } = {};
        const allItems = props.block.meta.groups.flatMap((g) => g.items);
        allItems.forEach((item) => {
          itemMap[item.id] = item;
        });
        for (const [group, items] of Object.entries(
          v.groups as { [key: string]: string[] },
        )) {
          v.groups[group] = items.map((i) => itemMap[i]);
        }
        return v;
      },
    },
  },
);

const allItems = ref<GroupDistributionItem[]>([]);
const collectBlockItems = () => {
  allItems.value = props.block.meta.groups.flatMap((g) => g.items);
};

const currentItem = ref<GroupDistributionItem[]>([]);

const onDragged = () => {
  if (!allItems.value.length) return;
  currentItem.value.push(allItems.value.pop()!);
};

const hasText = computed(() => {
  return (
    props.block.meta.text.length > 0 && props.block.meta.text !== "<p></p>"
  );
});

const correctMap = computed((): any => {
  if (
    answerExtra.value.correctMap &&
    Object.keys(answerExtra.value.correctMap).length != 0
  ) {
    return answerExtra.value.correctMap;
  }
  const cm: { [key: string]: string[] } = {};
  props.block.meta.groups.forEach((g) => {
    cm[g.id] = g.items.map((i) => i.id);
  });
  const m: { [key: string]: { [key: string]: boolean } } = {};
  for (const [group, items] of Object.entries(
    props.block.answerData!.meta.groups as {
      [key: string]: GroupDistributionItem[];
    },
  )) {
    const im: { [key: string]: boolean } = {};
    items.forEach((i) => {
      im[i.id] = cm[group].includes(i.id);
    });
    m[group] = im;
  }
  return m;
});

const reset = () => {
  blockReset();
  if (!answerGiven.value) {
    collectBlockItems();
    currentItem.value.push(allItems.value.pop()!);
  }

  // why????
  drag.value = false;
};

const getColor = (groupId: string, itemId: string): string => {
  if (!answerGiven.value) return "primary";
  return correctMap.value[groupId][itemId] ? "success" : "error";
};

onMounted(() => {
  collectBlockItems();
  if (!answerGiven.value) {
    currentItem.value.push(allItems.value.pop()!);
    return;
  }
  let itemMap: { [key: string]: any } = {};
  allItems.value.forEach((item) => {
    itemMap[item.id] = item;
  });
  const groups: { [key: string]: GroupDistributionItem[] } = {};
  for (const group of Object.keys(answerData.groups)) {
    groups[group] = answerData.groups[group].map((i) => itemMap[i.id]);
  }
  answerData.groups = groups;
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
    :has-answer="!allItems.length && !currentItem.length"
    @answer="processAnswer"
    @reset="reset"
    @up="$emit('up')"
    @down="$emit('down')"
    @edit="$emit('edit')"
    @delete="$emit('delete')"
  >
    <v-card-title v-if="!hasText" class="text-grey text-h4 font-weight-black">
      Group Distribution Block
    </v-card-title>

    <v-card-text>
      <VuetifyViewer
        v-if="hasText"
        :value="block.meta.text"
        class="bg-background"
      />
      <v-row justify="center">
        <v-col cols="4" style="min-height: 200px">
          <draggable
            v-if="!answerGiven && (currentItem.length || allItems.length)"
            item-key="id"
            v-model="currentItem"
            class="fill-height"
            @start="drag = true"
            @end="drag = false"
            :disabled="drag && currentItem.length > 0"
            animation="200"
            :group="`block-${block.id}`"
            @change="onDragged"
          >
            <template v-slot:item="{ element: item, index }">
              <v-card
                class="d-flex flex-column align-center justify-center fill-height"
              >
                <span>{{ item.text }}</span>
              </v-card>
            </template>
          </draggable>
          <v-card
            v-else
            variant="tonal"
            :color="answerGiven ? (isCorrect ? 'success' : 'error') : ''"
            class="d-flex fill-height align-center justify-center"
          >
            No items left
          </v-card>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col v-for="(group, groupIdx) in block.meta.groups" cols="6">
          <v-card
            min-height="200"
            class="fill-height d-flex flex-column"
            variant="outlined"
          >
            <v-card-title>{{ group.title }}</v-card-title>
            <v-card-text>
              <draggable
                animation="200"
                v-model="answerData.groups[group.id]"
                item-key="id"
                class="fill-height"
                :disabled="answerGiven"
                :group="`block-${block.id}`"
              >
                <template v-slot:item="{ element: item, index }">
                  <v-card
                    variant="tonal"
                    class="pa-3 my-1"
                    :color="getColor(group.id, item.id)"
                  >
                    {{ item.text }}
                  </v-card>
                </template>
              </draggable>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </BlockCardBase>
</template>
