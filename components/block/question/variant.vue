<script setup lang="ts">
const { variant, answerGiven, answerCorrect, selected } = defineProps<{
  selected: boolean;
  readonly: boolean;
  answerCorrect: boolean;
  answerGiven: boolean;
  variant: {
    id: number;
    correct: boolean;
    text?: string;
    image?: { src: string; id: string };
  };
}>();

const { text, image } = variant;

const variantBorder = (): string => {
  return selected ? "opacity-100 xl primary" : "";
};
</script>

<template>
  <v-card
    v-bind="$attrs"
    :class="{ 'readonly-variant': readonly }"
    :color="selected ? 'primary' : 'grey'"
  >
    <v-sheet
      class="position-absolute selected-mark bg-transparent d-flex"
      :border="variantBorder()"
      width="100%"
      height="100%"
      ripple
    >
      <v-icon
        v-if="answerGiven"
        :icon="answerCorrect ? 'mdi-check' : 'mdi-close'"
        class="ma-auto"
        :size="variant.image ? 150 : 50"
        :color="answerCorrect ? 'success' : 'error'"
      />
    </v-sheet>
    <v-img v-if="image" :src="`http://localhost:8000${image?.src}`" cover />
    <v-card-text v-else class="d-flex align-center">
      <v-icon
        class="mr-3"
        size="25"
        :icon="selected ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'"
      />
      <span class="text-h6">
        {{ text }}
      </span>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
.readonly-variant {
  pointer-events: none;
}

.selected-mark {
  z-index: 1;
}
</style>
