<script setup lang="ts">
import { useTheme } from "vuetify";
import type { Block, ConnectionBlockMeta, TextImageVariant } from "~/types";
const theme = useTheme();

const emits = defineEmits(["edit", "delete", "up", "down"]);
const { block, editMode, isLast, isFirst } = defineProps<{
  block: Block<ConnectionBlockMeta>;
  editMode: boolean;
  isLast: boolean;
  isFirst: boolean;
}>();

interface ItemMap {
  [key: string]: string;
}

const {
  answerGiven,
  isCorrect,
  isAnswerLoading,
  processAnswer,
  answerData,
  reset,
} = useBlockCard<{ pairs: ItemMap }, Object>({
  block: block,
  initialAnswerData: () => ({ pairs: {} }),
});

const resetAll = () => {
  reset();
  lines.value = [];
};

const lockLeft = ref(false);
const lockRight = ref(false);
const selectedElements = ref<TextImageVariant[]>([]);
const currentSelect = ref<string | null>(null);
const lineCoordinates = reactive<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}>({
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
});

const lines = ref<
  {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    left: string;
    right: string;
  }[]
>([]);

const leftColumn = ref<TextImageVariant[]>([
  ...shuffleArray<TextImageVariant>(
    block.meta.variants.map((v: any): TextImageVariant => v.left),
  ),
]);
const rightColumn = ref<TextImageVariant[]>([
  ...shuffleArray<TextImageVariant>(
    block.meta.variants.map((v: any): TextImageVariant => v.right),
  ),
]);

const correctMap: { [key: string]: string } = {};
block.meta.variants.forEach(({ left, right }) => {
  correctMap[left.id] = right.id;
  correctMap[right.id] = left.id;
});

const variants: { left: TextImageVariant; right: TextImageVariant }[] = [];

for (let i = 0; i < leftColumn.value.length; i++) {
  variants.push({ left: leftColumn.value[i], right: rightColumn.value[i] });
}

const isInLeft = (id: string): boolean => {
  return id in answerData.pairs;
};
const isInRight = (id: string): boolean => {
  return Object.values(answerData.pairs).includes(id);
};

const updateTempLine = (e: MouseEvent): void => {
  const card = document.getElementById(`connection-puzzle-id-${block.id}`)!;
  const cardRect = card.getBoundingClientRect();

  if (
    e.clientX - cardRect.left > cardRect.width ||
    e.clientX - cardRect.left < 0 ||
    e.clientY - cardRect.top > cardRect.height ||
    e.clientY - cardRect.top < 0
  ) {
    selectedElements.value = [];
    currentSelect.value = null;
    lockLeft.value = false;
    lockRight.value = false;
  }

  lineCoordinates.x2 = e.clientX - cardRect.left;
  lineCoordinates.y2 = e.clientY - cardRect.top;
};

const selectElement = (item: TextImageVariant, side: string, e: MouseEvent) => {
  // Add the selected element to the list
  currentSelect.value = item.id;

  // remove currenctSelect if pressed the same btn
  if (side === "left" && lockLeft.value && item.id === currentSelect.value) {
    lockLeft.value = false;
    selectedElements.value = [];
    currentSelect.value = null;

    window.removeEventListener("mousemove", updateTempLine);
    return;
  }
  if (side === "right" && lockRight.value && item.id === currentSelect.value) {
    lockRight.value = false;
    selectedElements.value = [];
    currentSelect.value = null;

    window.removeEventListener("mousemove", updateTempLine);
    return;
  }

  // remove line if item was already selected
  for (const [k, v] of Object.entries(answerData.pairs)) {
    let d = true;
    if (side === "left") {
      d = k === `${item.id}`;
    } else {
      d = v === item.id;
    }

    if (d) {
      let key = k as keyof Object;
      delete answerData.pairs[key];
      updateLineCoordinates();
      currentSelect.value = null;
      window.removeEventListener("mousemove", updateTempLine);
      return;
    }
  }

  if (side === "left") {
    lockLeft.value = true;
    selectedElements.value.unshift(item);
  } else {
    lockRight.value = true;
    selectedElements.value.push(item);
  }

  if (selectedElements.value.length === 1) {
    const cardId = `connection-puzzle-id-${block.id}`;
    const card = document.getElementById(cardId)!;
    const cardRect = card.getBoundingClientRect()!;

    const anchor = document
      .getElementById(`${side}-${item.id}-${block.id}`)!
      .getBoundingClientRect()!;

    const x1 = anchor.left + anchor.width / 2 - cardRect.left;
    const y1 = anchor.top + anchor.height / 2 - cardRect.top;
    lineCoordinates.x1 = x1;
    lineCoordinates.y1 = y1;
    lineCoordinates.x2 = e.clientX - cardRect.left;
    lineCoordinates.y2 = e.clientY - cardRect.top;
    window.addEventListener("mousemove", updateTempLine);
  } else {
    window.removeEventListener("mousemove", updateTempLine);
  }

  if (selectedElements.value.length === 2) {
    lockLeft.value = false;
    lockRight.value = false;
    currentSelect.value = null;
    let id = `${selectedElements.value[0].id}` as keyof Object;
    answerData.pairs[id] = selectedElements.value[1].id;
    updateLineCoordinates();

    // Clear the selected elements after connecting
    selectedElements.value = [];
  }
};

const updateLineCoordinates = (): void => {
  const card = document.getElementById(`connection-puzzle-id-${block.id}`)!;
  const cardRect = card.getBoundingClientRect();

  // Maybe worth optimization
  lines.value = [];
  for (const [k, v] of Object.entries(answerData.pairs)) {
    const rect1 = document
      .getElementById(`left-${k}-${block.id}`)!
      .getBoundingClientRect()!;
    const rect2 = document
      .getElementById(`right-${v}-${block.id}`)!
      .getBoundingClientRect()!;

    // Calculate the center points of both elements
    const x1 = rect1.left + rect1.width / 2 - cardRect.left;
    const y1 = rect1.top + rect1.height / 2 - cardRect.top;

    const x2 = rect2.left + rect2.width / 2 - cardRect.left;
    const y2 = rect2.top + rect2.height / 2 - cardRect.top;

    // Update the line coordinates
    lines.value.push({ x1, y1, x2, y2, left: k, right: v });
  }

  return;
};

const handleResize = (): void => {
  if (answerData.pairs) {
    updateLineCoordinates();
  }
};

const getBtnColor = (side: string, id: string): string => {
  if (answerGiven.value) {
    if (side === "right") {
      return answerData.pairs[correctMap[id]] == id ? "success" : "error";
    }
    return answerData.pairs[id] == correctMap[id] ? "success" : "error";
  }
  if (side === "left") {
    return isInLeft(id) || (currentSelect.value === id && lockLeft.value)
      ? "primary"
      : "";
  } else {
    return isInRight(id) || (currentSelect.value === id && lockRight.value)
      ? "primary"
      : "";
  }
};

const isBtnDisabled = (side: string, id: string): boolean => {
  if (editMode) return true;
  if (currentSelect.value === null) return false;
  if (side == "left") {
    return (lockLeft.value && id !== currentSelect.value) || isInLeft(id);
  } else {
    return (lockRight.value && id !== currentSelect.value) || isInRight(id);
  }
};

onMounted(() => {
  // Update line position on window resize
  updateLineCoordinates();
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
  window.removeEventListener("mousemove", updateTempLine);
});
const hasText = computed((): boolean => {
  return block.meta.text.length > 0 && block.meta.text !== "<p></p>";
});

const hasAnswer = computed((): boolean => {
  return leftColumn.value.length === Object.keys(answerData.pairs).length;
});
</script>

<template>
  <BlockCardBase
    :edit-mode="editMode"
    :isFirst="isFirst"
    :isLast="isLast"
    :id="`connection-puzzle-id-${block.id}`"
    :is-answer-loading="isAnswerLoading"
    :answer-given="answerGiven"
    :is-correct="isCorrect"
    :has-answer="hasAnswer"
    :block="block"
    @answer="processAnswer"
    @reset="resetAll"
    @up="$emit('up')"
    @down="$emit('down')"
    @edit="$emit('edit')"
    @delete="$emit('delete')"
  >
    <svg v-if="currentSelect !== null" class="line-container">
      <line
        class="line"
        :x1="lineCoordinates.x1"
        :y1="lineCoordinates.y1"
        :x2="lineCoordinates.x2"
        :y2="lineCoordinates.y2"
        :stroke="theme.current.value.colors.primary"
        stroke-width="2"
      ></line>
    </svg>
    <svg class="line-container">
      <line
        class="line"
        v-for="line in lines"
        :x1="line.x1"
        :y1="line.y1"
        :x2="line.x2"
        :y2="line.y2"
        :stroke="
          !answerGiven
            ? theme.current.value.colors.primary
            : correctMap[line.left] == line.right
              ? theme.current.value.colors.success
              : theme.current.value.colors.error
        "
        stroke-width="2"
      ></line>
    </svg>
    <v-card-title v-if="!hasText" class="text-grey text-h4 font-weight-black">
      Connection Puzzle
    </v-card-title>

    <v-card-text>
      <VuetifyViewer
        v-if="hasText"
        :value="block.meta.text"
        class="bg-background"
      />

      <!-- connection card -->
      <v-row>
        <v-col>
          <!-- LEFT SIDE -->
          <v-row v-for="variant in variants">
            <v-col>
              <block-connection-image-variant
                side="left"
                :variant="variant.left"
                :block="block"
                :color="getBtnColor('left', variant.left.id)"
                :readonly="
                  answerGiven || isBtnDisabled('left', variant.left.id)
                "
                :answerGiven="answerGiven"
                :answerCorrect="isCorrect"
                :selected="
                  isInLeft(variant.left.id) ||
                  (currentSelect == variant.left.id && lockLeft)
                "
                :icon="
                  isInLeft(variant.left.id) ||
                  (currentSelect === variant.left.id && lockLeft)
                    ? 'mdi-record'
                    : 'mdi-radiobox-blank'
                "
                @selectElement="selectElement"
              />
            </v-col>
            <v-col cols="1"></v-col>
            <v-col>
              <block-connection-image-variant
                side="right"
                :variant="variant.right"
                :block="block"
                :color="getBtnColor('right', variant.right.id)"
                :readonly="
                  answerGiven || isBtnDisabled('right', variant.right.id)
                "
                :answerGiven="answerGiven"
                :answerCorrect="isCorrect"
                :selected="
                  isInRight(variant.right.id) ||
                  (currentSelect == variant.right.id && lockRight)
                "
                :icon="
                  isInRight(variant.right.id) ||
                  (currentSelect === variant.right.id && lockRight)
                    ? 'mdi-record'
                    : 'mdi-radiobox-blank'
                "
                @selectElement="selectElement"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <!-- connection card -->
    </v-card-text>
  </BlockCardBase>
</template>

<style lang="scss" scoped>
.line-container {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 3;
  pointer-events: none;
}
</style>
