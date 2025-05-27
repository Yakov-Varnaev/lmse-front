<script setup lang="ts">
import type { Block, TrueFalseBlockMeta } from "~/types";

const alert = useAlert();
const emit = defineEmits<{
  (e: "update", data: TrueFalseBlockMeta): void;
  (e: "cancel"): void;
}>();
const props = defineProps<{ block: Block<TrueFalseBlockMeta> }>();
const data = reactive({ ...props.block });

const submit = () => {
  emit("update", data.meta);
};

const addStatement = () => {
  if (data.meta.statements.length >= 20) {
    alert.reportError("Maximum amount of variants achived!");
    return;
  }
  let id = data.meta.statements.length;
  data.meta.statements.push({ id, text: "", value: "false" });
};

const deleteStatement = (idx: number) => {
  data.meta.statements.splice(idx, 1);
  data.meta.statements.map(
    (v: { id: number }, i: number): number => (v.id = i),
  );
};

const allowUnknown = computed({
  get: () => {
    return data.meta.allowUnknown;
  },
  set: (v: boolean) => {
    data.meta.allowUnknown = v;
    if (v) return;
    data.meta.statements.map((s) => {
      if (s.value === "unknown") {
        s.value = "false";
      }
    });
  },
});
</script>

<template>
  <v-card>
    <v-card-text>
      <VuetifyTiptap
        v-model.trim="data.meta.text"
        class="editor bg-background"
        markdown-theme="github"
      />

      <v-divider class="mt-4"></v-divider>

      <v-sheet class="rounded pa-2">
        <v-row>
          <v-col>
            <v-checkbox v-model="allowUnknown" label="Allow Unknown">
            </v-checkbox>
          </v-col>
        </v-row>
        <v-row
          v-for="(statement, idx) in data.meta.statements"
          align="center"
          class="mt-3"
        >
          <v-col>
            <v-textarea
              v-model.trim="statement.text"
              density="compact"
              rows="1"
              auto-grow
            />
          </v-col>
          <v-col cols="3">
            <BlockTrueFalseSelector
              v-model="statement.value"
              :allow-unknown="data.meta.allowUnknown"
            />
          </v-col>
          <v-col class="d-flex" cols="1">
            <v-btn
              icon="mdi-delete-outline"
              class="mx-auto"
              variant="text"
              @click="() => deleteStatement(idx)"
            >
            </v-btn>
          </v-col>
        </v-row>
        <v-row no-gutters class="mt-2">
          <v-col>
            <v-btn @click="addStatement" block variant="tonal" color="primary">
              Add statement
            </v-btn>
          </v-col>
        </v-row>
      </v-sheet>
    </v-card-text>
    <v-card-actions>
      <ButtonBlock @cancel="$emit('cancel')" @submit="submit" />
    </v-card-actions>
  </v-card>
</template>
