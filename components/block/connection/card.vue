<script>
import { useTheme } from "vuetify";

export default {
  emits: ["edit", "delete"],
  props: {
    block: { type: Object, required: true },
    minify: { type: Boolean, required: true },
    editMode: { type: Boolean, required: true },
  },
  setup() {
    return { theme: useTheme() };
  },
  data() {
    return {
      lockLeft: false,
      currentSelect: null,
      lockRight: false,
      selectedElements: [],
      lines: [],
      mousePosition: { x: 0, y: 0 },
      leftColumn: [
        { id: 0, text: "Left 0" },
        { id: 1, text: "Left 1" },
        { id: 2, text: "Left 2" },
      ],
      rightColumn: [
        { id: 0, text: "right 0" },
        { id: 1, text: "right 1" },
        { id: 2, text: "right 2" },
      ],
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
    isInLeft(id) {
      return `${id}` in this.pairs;
    },
    isInRight(id) {
      return Object.values(this.pairs).includes(id);
    },
    selectElement(item, side) {
      // ensure cannot click on the same column twice
      // ensure you cannot use same item twice 0 -> 1, 1 -> 1

      // Add the selected element to the list

      // remove line if item was already selected
      this.currentSelect = item.id;
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
      const card = document.getElementById("card-id");
      const cardRect = card.getBoundingClientRect();

      // Maybe worth optimization
      this.lines = [];
      for (const [k, v] of Object.entries(this.pairs)) {
        const rect1 = document
          .getElementById(`left-${k}`)
          .getBoundingClientRect();
        const rect2 = document
          .getElementById(`right-${v}`)
          .getBoundingClientRect();

        // Calculate the center points of both elements
        const x1 = rect1.left + rect1.width / 2 - cardRect.left;
        const y1 = rect1.top + rect1.height / 2 - cardRect.top;

        const x2 = rect2.left + rect2.width / 2 - cardRect.left;
        const y2 = rect2.top + rect2.height / 2 - cardRect.top;

        // Update the line coordinates
        this.lines.push({ x1, y1, x2, y2 });
      }

      return;
    },
    handleResize() {
      if (this.pairs) {
        this.updateLineCoordinates();
      }
    },
  },
  mounted() {
    // Update line position on window resize
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    // Remove the resize event listener
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>

<template>
  <v-hover>
    <template #default="{ isHovering, props }">
      <v-card
        v-bind="props"
        :variant="editMode ? 'outlined' : 'text'"
        class="border-dashed"
        elevation="0"
        id="card-id"
      >
        <svg class="line-container">
          <line
            class="line"
            v-for="line in lines"
            :x1="line.x1"
            :y1="line.y1"
            :x2="line.x2"
            :y2="line.y2"
            :stroke="theme.current.value.colors.primary"
            stroke-width="2"
          ></line>
        </svg>

        lines cnt: {{ lines.length }}
        <div></div>
        {{ pairs }}
        <div></div>
        {{ selectedElements }}
        <div>{{ lockLeft }} | {{ lockRight }}</div>
        <div
          v-if="isHovering && editMode"
          class="position-absolute right-0 mt-2 mr-2"
        >
          <v-btn @click.stop="$emit('edit')" icon="mdi-pencil" variant="flat" />
          <v-btn
            @click.stop="$emit('delete')"
            icon="mdi-delete-outline"
            variant="flat"
          />
        </div>
        <v-card-text>
          <!-- connection card -->
          <v-row v-resize="updateLineCoordinates">
            <v-col>
              <v-card
                v-for="item in leftColumn"
                class="pa-2 ma-2 d-flex align-center justify-space-between"
              >
                {{ item.text }}
                <v-btn
                  :disabled="
                    currentSelect === null
                      ? false
                      : (lockLeft && item.id !== currentSelect) ||
                        isInLeft(item.id)
                  "
                  icon
                  variant="flat"
                  :id="`left-${item.id}`"
                  @click="selectElement(item, 'left')"
                >
                  <v-icon
                    :color="`${item.id}` in pairs ? 'primary' : ''"
                    :icon="
                      `${item.id}` in pairs
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
                class="pa-2 ma-2 d-flex align-center justify-space-between"
              >
                <v-btn
                  icon
                  variant="flat"
                  :id="`right-${item.id}`"
                  :disabled="
                    currentSelect === null
                      ? false
                      : (lockRight && item.id !== currentSelect) ||
                        isInRight(item.id)
                  "
                  @click="selectElement(item, 'right')"
                >
                  <v-icon
                    :color="
                      Object.values(pairs).includes(item.id) ? 'primary' : ''
                    "
                    :icon="
                      Object.values(pairs).includes(item.id)
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
      </v-card>
    </template>
  </v-hover>
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

.line {
}
</style>
