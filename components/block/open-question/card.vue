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
      answer: "",
      answerGiven: false,
      correctAnswer: false,
    };
  },
  methods: {
    reset() {
      Object.assign(this.$data, this.$options.data.apply(this));
    },
    processAnswer() {
      if (this.block.caseSensitive) {
        this.correctAnswer = this.answer == this.block.answer.text;
      } else {
        this.correctAnswer =
          this.answer.toLowerCase() == this.block.answer.text.toLowerCase();
      }
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
          Open Question
        </v-card-title>

        <v-card-text>
          <VuetifyViewer
            v-if="hasText"
            :value="block.text"
            class="bg-background"
          />

          <v-text-field
            v-if="!answerGiven"
            :disabled="editMode"
            v-model.trim="answer"
            :value="
              editMode ? this.block.answer.text || 'Add answer...' : answer
            "
          />
          <v-card
            v-else
            class="mb-5"
            :variant="!answerGiven ? 'text' : 'tonal'"
            :color="answerGiven ? (correctAnswer ? 'success' : 'error') : ''"
          >
            <v-card-text>
              {{ answer }}
            </v-card-text>
          </v-card>
        </v-card-text>
        <v-card-actions v-if="!editMode">
          <v-btn
            v-if="!answerGiven"
            :disabled="!this.answer"
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
              <v-btn
                class="ml-2"
                plain
                prepend-icon="mdi-reload"
                @click="reset"
              >
                Try Again
              </v-btn>
            </div>
          </v-row>
        </v-card-actions>
      </v-card>
    </template>
  </v-hover>
</template>
