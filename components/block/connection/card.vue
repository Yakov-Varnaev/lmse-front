<script>
import { useTheme } from "vuetify";

function shuffleArray(array) {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default {
  emits: ["edit", "delete", "up", "down"],
  props: {
    blockId: { type: String, required: true },
    block: { type: Object, required: true },
    editMode: { type: Boolean, required: true },
    isLast: { type: Boolean, required: true },
    isFirst: { type: Boolean, required: true },
  },
  setup() {
    return { theme: useTheme() };
  },
  data() {
    return {
      leftColumn: [...shuffleArray(this.block.variants.map((v) => v.left))],
      rightColumn: [...shuffleArray(this.block.variants.map((v) => v.right))],

      answerGiven: false,
      correctAnswer: false,

      lockLeft: false,
      currentSelect: null,
      lockRight: false,
      selectedElements: [],
      lines: [],
      mousePosition: { x: 0, y: 0 },
      pairs: {},
      lineCoordinates: {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
      },
      spawned: true,
      lineVisible: false,
    };
  },
  methods: {
    reset() {
      Object.assign(this.$data, this.$options.data.apply(this));
    },
    processAnswer() {
      this.correctAnswer = Object.entries(this.pairs).every(([k, v]) => {
        return k == v;
      });
      this.answerGiven = true;
    },
    isInLeft(id) {
      return `${id}` in this.pairs;
    },
    isInRight(id) {
      return Object.values(this.pairs).includes(id);
    },
    updateTempLine(e) {
      const card = document.getElementById(
        `connection-puzzle-id-${this.blockId}`,
      );
      const cardRect = card.getBoundingClientRect();

      if (
        e.clientX - cardRect.left > cardRect.width ||
        e.clientX - cardRect.left < 0 ||
        e.clientY - cardRect.top > cardRect.height ||
        e.clientY - cardRect.top < 0
      ) {
        this.selectedElements = [];
        this.currentSelect = null;
        this.lockLeft = false;
        this.lockRight = false;
      }

      this.lineCoordinates.x2 = e.clientX - cardRect.left;
      this.lineCoordinates.y2 = e.clientY - cardRect.top;
    },
    selectElement(item, side, e) {
      // Add the selected element to the list

      this.currentSelect = item.id;

      // remove currenctSelect if pressed the same btn
      if (side === "left" && this.lockLeft && item.id === this.currentSelect) {
        this.lockLeft = false;
        this.selectedElements = [];
        this.currentSelect = null;

        window.removeEventListener("mousemove", this.updateTempLine);
        return;
      }
      if (
        side === "right" &&
        this.lockRight &&
        item.id === this.currentSelect
      ) {
        this.lockRight = false;
        this.selectedElements = [];
        this.currentSelect = null;

        window.removeEventListener("mousemove", this.updateTempLine);
        return;
      }

      // remove line if item was already selected
      for (const [k, v] of Object.entries(this.pairs)) {
        let d = true;
        if (side === "left") {
          d = k === `${item.id}`;
        } else {
          d = v === item.id;
        }

        if (d) {
          delete this.pairs[k];
          this.updateLineCoordinates();
          this.currentSelect = null;
          return;
        }
      }

      if (side === "left") {
        this.lockLeft = true;
        this.selectedElements.unshift(item);
      } else {
        this.lockRight = true;
        this.selectedElements.push(item);
      }

      if (this.selectedElements.length === 1) {
        const cardId = `connection-puzzle-id-${this.blockId}`;
        const card = document.getElementById(cardId);
        const cardRect = card.getBoundingClientRect();

        const anchor = document
          .getElementById(`${side}-${item.id}-${this.blockId}`)
          .getBoundingClientRect();

        const x1 = anchor.left + anchor.width / 2 - cardRect.left;
        const y1 = anchor.top + anchor.height / 2 - cardRect.top;
        this.lineCoordinates.x1 = x1;
        this.lineCoordinates.y1 = y1;
        this.lineCoordinates.x2 = e.clientX - cardRect.left;
        this.lineCoordinates.y2 = e.clientY - cardRect.top;
        window.addEventListener("mousemove", this.updateTempLine);
      } else {
        window.removeEventListener("mousemove", this.updateTempLine);
      }

      if (this.selectedElements.length === 2) {
        this.lockLeft = false;
        this.lockRight = false;
        this.currentSelect = null;
        this.pairs[this.selectedElements[0].id] = this.selectedElements[1].id;
        this.updateLineCoordinates();

        // Clear the selected elements after connecting
        this.selectedElements = [];
      }
    },
    updateLineCoordinates() {
      const card = document.getElementById(
        `connection-puzzle-id-${this.blockId}`,
      );
      const cardRect = card.getBoundingClientRect();

      // Maybe worth optimization
      this.lines = [];
      for (const [k, v] of Object.entries(this.pairs)) {
        const rect1 = document
          .getElementById(`left-${k}-${this.blockId}`)
          .getBoundingClientRect();
        const rect2 = document
          .getElementById(`right-${v}-${this.blockId}`)
          .getBoundingClientRect();

        // Calculate the center points of both elements
        const x1 = rect1.left + rect1.width / 2 - cardRect.left;
        const y1 = rect1.top + rect1.height / 2 - cardRect.top;

        const x2 = rect2.left + rect2.width / 2 - cardRect.left;
        const y2 = rect2.top + rect2.height / 2 - cardRect.top;

        // Update the line coordinates
        this.lines.push({ x1, y1, x2, y2, left: k, right: v });
      }

      return;
    },
    handleResize() {
      if (this.pairs) {
        this.updateLineCoordinates();
      }
    },
    getBtnColor(side, id) {
      if (this.answerGiven) {
        return this.pairs[id] == id ? "success" : "red";
      }
      if (side === "left") {
        return `${id}` in this.pairs ||
          (this.currentSelect === id && this.lockLeft)
          ? "primary"
          : "";
      } else {
        return Object.values(this.pairs).includes(id) ||
          (this.currentSelect === id && this.lockRight)
          ? "primary"
          : "";
      }
    },
    getCardColor(side, id) {
      let res = this.getBtnColor(side, id);
      return res === "red" ? "error" : res;
    },
    isBtnDisabled(side, id) {
      if (this.editMode) return true;
      if (this.currentSelect === null) return false;
      if (side == "left") {
        return (
          (this.lockLeft && id !== this.currentSelect) || this.isInLeft(id)
        );
      } else {
        return (
          (this.lockRight && id !== this.currentSelect) || this.isInRight(id)
        );
      }
    },
  },
  mounted() {
    // Update line position on window resize
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("mousemove", this.updateTempLine);
  },
  computed: {
    hasText() {
      return this.block.text.length > 0 && this.block.text !== "<p></p>";
    },
    hasAnswer() {
      return this.leftColumn.length === Object.keys(this.pairs).length;
    },
  },
};
</script>

<template>
  <BlockCardBase
    :edit-mode="editMode"
    :isFirst="isFirst"
    :isLast="isLast"
    :id="`connection-puzzle-id-${blockId}`"
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
            : line.right == line.left
              ? theme.current.value.colors.success
              : '#F44336'
        "
        stroke-width="2"
      ></line>
    </svg>
    <v-card-title v-if="!hasText" class="text-grey text-h4 font-weight-black">
      Connection Puzzle
    </v-card-title>

    <v-card-text>
      <VuetifyViewer v-if="hasText" :value="block.text" class="bg-background" />

      <!-- connection card -->
      <v-row>
        <v-col>
          <v-card
            v-for="item in leftColumn"
            :variant="answerGiven || isInLeft(item.id) ? 'tonal' : 'elevated'"
            :color="getCardColor('left', item.id)"
            class="pa-2 ma-2 d-flex align-center justify-space-between"
          >
            {{ item.text }}
            <v-btn
              class="bg-background"
              :disabled="isBtnDisabled('left', item.id)"
              :readonly="answerGiven"
              exactn
              icon
              variant="flat"
              :id="`left-${item.id}-${blockId}`"
              @click="(e) => selectElement(item, 'left', e)"
            >
              <v-icon
                :color="getBtnColor('left', item.id)"
                :icon="
                  `${item.id}` in pairs ||
                  (currentSelect === item.id && lockLeft)
                    ? 'mdi-record'
                    : 'mdi-radiobox-blank'
                "
              />
            </v-btn>
          </v-card>
        </v-col>
        <v-col cols="1"></v-col>
        <v-col>
          <v-card
            v-for="item in rightColumn"
            :variant="answerGiven || isInRight(item.id) ? 'tonal' : 'elevated'"
            :color="getCardColor('right', item.id)"
            class="pa-2 ma-2 d-flex align-center justify-space-between"
          >
            <v-btn
              icon
              class="bg-background"
              variant="flat"
              :id="`right-${item.id}-${blockId}`"
              :disabled="isBtnDisabled('right', item.id)"
              :readonly="answerGiven"
              @click="(e) => selectElement(item, 'right', e)"
            >
              <v-icon
                :color="getBtnColor('right', item.id)"
                :icon="
                  Object.values(pairs).includes(item.id) ||
                  (currentSelect === item.id && lockRight)
                    ? 'mdi-record'
                    : 'mdi-radiobox-blank'
                "
              />
            </v-btn>
            {{ item.text }}
          </v-card>
        </v-col>
      </v-row>
      <!-- connection card -->
    </v-card-text>
    <v-card-actions v-if="!editMode">
      <v-btn
        v-if="!answerGiven"
        :disabled="!hasAnswer"
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
              'text-success': correctAnswer,
              'text-error': !correctAnswer,
            }"
          >
            {{ correctAnswer ? "Correct!" : "Wrong!" }}
          </span>
          <v-btn class="ml-2" plain prepend-icon="mdi-reload" @click="reset">
            Try Again
          </v-btn>
        </div>
      </v-row>
    </v-card-actions>
  </BlockCardBase>
</template>

<style lang="scss">
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
