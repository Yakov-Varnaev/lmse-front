<script setup lang="ts">
import { ref, watch } from "vue";
import type { Block, OrderingBlockMeta } from "~/types";

// Props
const { block } = defineProps<{
  block: Block<OrderingBlockMeta>;
}>();

// Emits
const emit = defineEmits<{
  (e: "update", data: OrderingBlockMeta): void;
  (e: "cancel"): void;
}>();

// Setup
const alert = useAlert();

// Reactive state
const data = ref({ ...block });
const newOptionText = ref("");
const optionText = ref("");
const allowPop = ref(false);
const drag = ref(false);
const selectedOption = ref<number | null>(null);

// Methods

function submit() {
  emit("update", data.value.meta);
}

function addVariant() {
  if (newOptionText.value.trim().length === 0) {
    alert.reportInfo("Item cannot be blank!");
    return;
  }
  if (data.value.meta.options.length >= 30) {
    alert.reportError("Maximum amount of items achieved!");
    return;
  }
  const id = data.value.meta.options.length;
  data.value.meta.options.push({ id, text: newOptionText.value });
  newOptionText.value = "";
}

function popLast() {
  if (optionText.value.length !== 0) {
    return;
  } else if (!allowPop.value) {
    allowPop.value = true;
    setTimeout(() => {
      allowPop.value = false;
    }, 350);
    return;
  }
  if (!allowPop.value) return;
  const last = data.value.meta.options.pop();
  if (last) newOptionText.value = last.text;
}

function deleteVariant(idx: number) {
  data.value.meta.options.splice(idx, 1);
  data.value.meta.options.forEach((v, i) => (v.id = i));
}

function editOption(idx: number) {
  if (selectedOption.value === idx) {
    selectedOption.value = null;
    optionText.value = "";
    return;
  }
  optionText.value = data.value.meta.options[idx].text;
  selectedOption.value = idx;
}

function saveOption() {
  if (optionText.value.trim().length === 0) {
    alert.reportInfo("Item cannot be blank!");
    return;
  }
  if (selectedOption.value !== null) {
    data.value.meta.options[selectedOption.value].text = optionText.value;
    selectedOption.value = null;
    optionText.value = "";
  }
}

// Watchers

watch(optionText, (newVal) => {
  if (newVal.length < 2) return;
  const l = newVal.length;
  if (newVal.charAt(l - 1) === " " && newVal.charAt(l - 2) === " ") {
    optionText.value = optionText.value.trim();
    addVariant();
  }
});
</script>

<template>
  <v-card variant="outlined">
    <v-card-text>
      <VuetifyTiptap
        v-model.trim="data.meta.text"
        class="editor bg-background"
        markdown-theme="github"
      />

      <v-divider class="mt-4"></v-divider>

      <v-sheet class="rounded pa-2">
        <v-row no-gutters>
          <v-checkbox v-model="data.meta.failOnFirst" label="Fail on first" />
        </v-row>
        <v-row no-gutters>
          <v-card min-height="50" width="100%" color="primary" variant="tonal">
            <div v-if="data.meta.options.length">
              <draggable
                animation="200"
                v-model="data.meta.options"
                item-key="id"
                @start="drag = true"
                @end="drag = false"
              >
                <template #item="{ element: option, index: idx }">
                  <v-chip
                    :class="{
                      'ma-2': true,
                      'cursor-grab': !drag,
                      'cursor-grabbing': drag,
                    }"
                    :color="selectedOption === idx ? 'warning' : 'primary'"
                    label
                    readonly
                    @click="() => editOption(idx)"
                  >
                    {{ option.text }}
                    <template #append>
                      <v-icon
                        icon="mdi-close-circle"
                        size="md"
                        class="ml-2"
                        @click.stop="() => deleteVariant(idx)"
                      />
                    </template>
                  </v-chip>
                </template>
              </draggable>
            </div>
            <div v-else class="d-flex fill-height align-center pa-3">
              <span> No items yet... </span>
            </div>
          </v-card>
        </v-row>
        <v-row no-gutters align="center" class="mt-3">
          <v-text-field
            v-if="selectedOption === null"
            :hide-details="true"
            density="compact"
            v-on:keyup.enter="addVariant"
            v-on:keyup.backspace="popLast"
            v-model="newOptionText"
          />
          <v-text-field
            v-else
            :hide-details="true"
            density="compact"
            v-on:keyup.enter="saveOption"
            v-model="optionText"
          />
        </v-row>
        <v-row no-gutters class="mt-2">
          <v-col>
            <v-btn
              v-if="selectedOption === null"
              @click="addVariant"
              block
              variant="tonal"
              color="primary"
            >
              Add item
            </v-btn>
            <v-btn
              v-else
              @click="saveOption"
              block
              variant="tonal"
              color="primary"
            >
              Save
            </v-btn>
          </v-col>
        </v-row>
      </v-sheet>

      <v-divider class="mb-4"></v-divider>
    </v-card-text>
    <v-card-actions>
      <ButtonBlock @cancel="$emit('cancel')" @submit="submit" />
    </v-card-actions>
  </v-card>
</template>
