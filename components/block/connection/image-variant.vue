<script setup lang="ts">
import type { Block, ConnectionBlockMeta, TextImageVariant } from "~/types";

const { variant, answerGiven, answerCorrect, selected } = defineProps<{
  side: string;
  selected: boolean;
  readonly: boolean;
  color: string;
  icon: string;
  answerCorrect: boolean;
  answerGiven: boolean;
  block: Block<ConnectionBlockMeta>;
  variant: TextImageVariant;
}>();

const { text, image } = variant;

const emits = defineEmits(["selectElement"]);

const variantBorder = (): string => {
  return selected ? "opacity-100 xl primary" : "";
};
</script>
<template>
  <v-card
    height="100%"
    :variant="answerGiven || selected ? 'tonal' : 'elevated'"
    :color="selected ? 'primary' : 'grey'"
    :class="{ 'readonly-variant': readonly, 'd-flex': true }"
    @click="(e: MouseEvent) => $emit('selectElement', variant, side, e)"
  >
    <v-sheet
      v-if="false"
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
    <v-img v-if="image" :src="$media(image.src)" cover>
      <div class="d-flex fill-height">
        <v-btn
          :class="{
            'bg-transparent  my-auto': true,
            'ml-auto mr-2': side === 'left',
            'mr-auto ml-2': side !== 'left',
          }"
          exactn
          icon
          variant="flat"
          :id="`${side}-${variant.id}-${block.id}`"
          @click.stop="
            (e: MouseEvent) => $emit('selectElement', variant, side, e)
          "
        >
          <v-icon :color="color" :icon="icon" />
        </v-btn>
      </div>
    </v-img>
    <v-card-text
      v-else
      :class="{
        'd-flex fill-height align-center justify-space-between': true,
        'flex-row-reverse': side === 'right',
      }"
    >
      <span class="text-h6">
        {{ text }}
      </span>
      <v-btn
        class="bg-transparent mr-2 my-auto"
        exactn
        icon
        variant="flat"
        :id="`${side}-${variant.id}-${block.id}`"
        @click.stop="
          (e: MouseEvent) => $emit('selectElement', variant, side, e)
        "
      >
        <v-icon :color="color" :icon="icon" />
      </v-btn>
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
