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
    return {
      answer: [],
      answerGiven: false,
      correctAnswer: false,
    };
  },
  methods: {
    reset() {
      Object.assign(this.$data, this.$options.data.apply(this));
    },
    processAnswer() {
      const compareArrays = (a, b) =>
        a.length === b.length &&
        a.every((element, index) => element === b[index]);

      const correctAnswers = this.block.variants
        .filter((v) => v.correct)
        .map((v) => v.id);

      this.correctAnswer = compareArrays(correctAnswers, this.answer);
      this.answerGiven = true;
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
      Question with Variants
    </v-card-title>

    <v-card-text>
      <VuetifyViewer v-if="hasText" :value="block.text" class="bg-background" />
      <v-card
        v-for="variant in block.variants"
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
          :label="variant.text"
          v-model="answer"
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
