<script setup lang="ts">
const emit = defineEmits(["edit", "delete", "up", "down", "reset", "answer"]);
defineProps({
  id: { type: String, required: false },
  isLast: { type: Boolean, required: true },
  isFirst: { type: Boolean, required: true },
  editMode: { type: Boolean, required: true },
  hideBottom: { type: Boolean, requred: false, default: false },
  answerGiven: { type: Boolean, required: false },
  isCorrect: { type: Boolean, required: false },
  isAnswerLoading: { type: Boolean, required: false },
  hasAnswer: { type: Boolean, required: false },
});
</script>

<template>
  <v-hover>
    <template #default="{ isHovering, props }">
      <v-card
        v-bind="props"
        :variant="editMode ? 'outlined' : 'text'"
        class="border-dashed"
        elevation="0"
        :id="id"
      >
        <div
          v-if="isHovering && editMode"
          class="position-absolute right-0 mt-2 mr-2"
        >
          <v-btn
            @click.stop="$emit('edit')"
            icon="mdi-pencil"
            variant="flat"
            size="small"
            class="ml-1"
          />
          <v-btn
            @click.stop="$emit('delete')"
            icon="mdi-delete-outline"
            variant="flat"
            size="small"
            class="ml-1"
          />
          <v-btn
            @click.stop="$emit('up')"
            :disabled="isFirst"
            icon="mdi-arrow-up"
            variant="flat"
            size="small"
            class="ml-1"
          />
          <v-btn
            @click.stop="$emit('down')"
            :disabled="isLast"
            icon="mdi-arrow-down"
            variant="flat"
            size="small"
            class="ml-1"
          />
        </div>
        <slot />
        <slot name="bottom" v-if="!hideBottom">
          <v-card-actions v-if="!editMode">
            <v-btn
              v-if="!answerGiven"
              :disabled="!hasAnswer"
              :loading="isAnswerLoading"
              color="success"
              variant="tonal"
              block
              @click="emit('answer')"
            >
              Answer
            </v-btn>
            <v-row no-gutters justify="center">
              <div class="d-flex align-center">
                <span
                  :class="{
                    'text-h5': true,
                    'text-success': isCorrect,
                    'text-error': !isCorrect,
                  }"
                >
                  {{ isCorrect ? "Correct!" : "Wrong!" }}
                </span>
                <v-btn
                  class="ml-2"
                  plain
                  prepend-icon="mdi-reload"
                  @click="emit('reset')"
                >
                  Try Again
                </v-btn>
              </div>
            </v-row>
          </v-card-actions>
        </slot>
      </v-card>
    </template>
  </v-hover>
</template>
