<script>
export default {
  emits: ["edit", "delete", "up", "down"],
  props: {
    block: { type: Object, required: true },
    editMode: { type: Boolean, required: true },
    isLast: { type: Boolean, required: true },
    isFirst: { type: Boolean, required: true },
  },
  data() {
    let opts = !this.editMode
      ? shuffleArray(this.block.options)
      : this.block.options;
    return {
      groupName: crypto.randomUUID(),
      answer: [],
      drag: false,
      options: [...opts],
      answerGiven: false,
      correctAnswer: false,
    };
  },
  methods: {
    reset() {
      Object.assign(this.$data, this.$options.data.apply(this));
    },
    processAnswer() {
      var failed = false;
      this.correctnessArr = this.block.options.map((opt, i) => {
        let correct = opt.text == this.answer[i].text;
        if (!correct) {
          failed = true;
        } else {
          if (failed && this.block.failOnFirst) {
            return false;
          }
        }
        return correct;
      });
      this.correctAnswer = this.correctnessArr.every((v) => {
        return v;
      });

      this.answerGiven = true;
    },
  },
  watch: {
    drag() {
      if (!this.answerGiven) return;
      this.answerGiven = false;
      this.correctAnswer = false;
      this.correctnessArr = [];
    },
  },
  computed: {
    hasText() {
      return this.block.text.length > 0 && this.block.text !== "<p></p>";
    },
  },
};
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
      Ordering Puzzle
    </v-card-title>

    <v-card-text>
      <VuetifyViewer
        v-if="hasText"
        :value="block.text"
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
        :color="
          !answerGiven ? 'primary' : correctAnswer ? 'success' : 'primary'
        "
      >
        <v-tooltip
          activator="parent"
          location="top"
          v-if="!answer.length && !editMode"
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
          v-model="answer"
          item-key="id"
          :disabled="editMode || (answerGiven && correctAnswer)"
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
    <v-card-actions v-if="!editMode">
      <v-btn
        v-if="!answerGiven"
        :disabled="options.length > 0"
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
