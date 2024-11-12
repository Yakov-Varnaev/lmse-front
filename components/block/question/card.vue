<script>
export default {
  emits: ["edit"],
  props: {
    block: { type: Object, required: true },
    minify: { type: Boolean, required: true },
    editMode: { type: Boolean, required: true },
  },
  data() {
    return {
      answer: [],
      answerGiven: false,
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
      this.answerGiven = true;
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
        <v-btn
          v-if="isHovering && editMode"
          class="position-absolute right-0 mt-2 mr-2"
          @click.stop="$emit('edit')"
        >
          edit
        </v-btn>
        <v-card-text>
          <VuetifyViewer :value="block.text" class="bg-background" />
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
        <v-card-actions v-if="!answerGiven && !editMode">
          <v-btn
            v-if="!answerGiven"
            color="success"
            variant="tonal"
            block
            @click="processAnswer"
          >
            Answer
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-hover>
</template>

<style lang="scss" scope>
$card-disabled-opacity: 0;

.answer-card {
}
</style>
