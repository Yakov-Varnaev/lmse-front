<script setup lang="ts">
import type { Block } from "~/types";

const emit = defineEmits(["edit", "delete", "up", "down", "reset", "answer"]);
const { hideBottom = false } = defineProps<{
  id?: string;
  isLast: boolean;
  isFirst: boolean;
  editMode: boolean;
  hideBottom?: boolean;
  answerGiven?: boolean;
  isCorrect?: boolean;
  isAnswerLoading?: boolean;
  hasAnswer?: boolean;
  block: Block<any>;
}>();
</script>

<template>
  <v-hover>
    <template #default="{ isHovering, props }">
      <v-card
        v-bind="props"
        :variant="editMode ? 'outlined' : 'text'"
        class="border-dashed overflow-visible"
        elevation="0"
        :id="id"
        min-height="75"
      >
        <v-tooltip :text="templateTitleMap[block.kind].subtitle">
          <template v-slot:activator="{ props }">
            <v-chip
              v-bind="props"
              v-if="editMode"
              size="xs"
              class="px-2 kind-hint opacity-100"
              variant="flat"
            >
              {{ templateTitleMap[block.kind].title }}
            </v-chip>
          </template>
        </v-tooltip>
        <div class="overflow-hidden btn-block" v-if="isHovering">
          <div
            v-if="editMode"
            class="position-absolute right-0 pa-2 bg-background rounded-te rounded-bs-xl"
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
        </div>

        <!-- body -->
        <div class="card-body">
          <slot />
        </div>

        <!-- body -->
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
            <v-row v-else no-gutters justify="center">
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

<style lang="scss">
.btn-block {
}
.card-body {
  position: relative;
  z-index: -1;
}
.kind-hint {
  position: absolute;
  top: -5px;
  left: 10px;
  font-size: 9px;
}
</style>
