<script>
export default {
  emits: ["edit", "delete"],
  props: {
    block: { type: Object, required: true },
    minify: { type: Boolean, required: true },
    editMode: { type: Boolean, required: true },
  },
  data() {
    return {
      answer: [],
      answerGiven: false,
      correctAnswer: false,
    };
  },
  methods: {
    cardPressAnswer(id) {
      const idx = this.answer.indexOf(id);
      console.log(this.answer, id);
      if (idx === -1) {
        this.answer.push(id);
      } else {
        this.answer.splice(idx, 1);
      }
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
  <v-hover>
    <template #default="{ isHovering, props }">
      <v-card
        v-bind="props"
        :variant="editMode ? 'outlined' : 'text'"
        class="border-dashed"
      >
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

        <v-card-title
          v-if="!hasText"
          class="text-grey text-h4 font-weight-black"
        >
          Add question...
        </v-card-title>

        <v-card-text>
          <VuetifyViewer
            v-if="hasText"
            :value="block.text"
            class="bg-background"
          />
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
            <span
              :class="{
                'text-h5': true,
                'text-success': correctAnswer,
                'text-error': !correctAnswer,
              }"
            >
              {{ correctAnswer ? "Correct!" : "Wrong!" }}
            </span>
          </v-row>
        </v-card-actions>
      </v-card>
    </template>
  </v-hover>
</template>
