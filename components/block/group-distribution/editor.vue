<script setup lang="ts">
import type { Block, GroupDistributionMeta } from "~/types";

const alert = useAlert();
const emit = defineEmits(["update", "cancel"]);
const props = defineProps<{
  block: Block<GroupDistributionMeta>;
  readonly: boolean;
}>();
const data = reactive(JSON.parse(JSON.stringify(props.block)));

const submit = () => {
  emit("update", data.meta);
};

const addGroup = () => {
  if (data.meta.groups.length > 9) {
    alert.reportWarning("Maximum amount of groups achieved");
    return;
  }
  data.meta.groups.push({
    id: crypto.randomUUID(),
    title: `Group #${data.meta.groups.length}`,
    items: [],
  });
};

const removeGroup = (idx: number) => {
  data.meta.groups.splice(idx, 1);
};

const addGroupItem = (groupIdx: number) => {
  if (data.meta.groups[groupIdx].items.length > 9) {
    alert.reportWarning("Maximum amount of group items achieved");
    return;
  }
  data.meta.groups[groupIdx].items.push({
    id: crypto.randomUUID(),
    groupId: data.meta.groups[groupIdx].id,
    text: `Item #${data.meta.groups[groupIdx].items.length}`,
  });
};

const removeGroupItem = (groupIdx: number, idx: number) => {
  data.meta.groups[groupIdx].items.splice(idx, 1);
};
</script>

<template>
  <v-card>
    <VuetifyTiptap
      v-model.trim="data.meta.text"
      class="editor bg-background"
      markdown-theme="github"
      :disabled="readonly"
    />
    <v-divider class="mt-4"></v-divider>

    <v-sheet class="rounded pa-2 mt-2">
      <v-row justify="center">
        <v-col v-for="(group, groupIdx) in data.meta.groups" cols="6">
          <!-- group card-->
          <v-card
            min-height="200"
            class="fill-height d-flex flex-column"
            variant="outlined"
          >
            <v-card-title class="d-flex align-center justify-space-between">
              <v-text-field
                class="mt-3"
                v-model="group.title"
                variant="underlined"
                color="primary"
                density="compact"
                :readonly="readonly"
              />
              <v-btn
                class="ml-1"
                flat
                :disabled="readonly"
                icon="mdi-delete-outline"
                @click="() => removeGroup(groupIdx)"
              ></v-btn>
            </v-card-title>
            <v-card-text>
              <!-- group item -->
              <v-card
                class="mt-1"
                v-for="(item, itemIdx) in group.items"
                variant="text"
              >
                <v-row no-gutters>
                  <v-col>
                    <BlockEditorTextImageField
                      :block="block"
                      :id="`group-${block.id}-${group.id}-${item.id}`"
                      :variant="item"
                      :readonly="readonly"
                    />
                  </v-col>
                  <v-col cols="2">
                    <v-btn
                      class="mx-1"
                      flat
                      :disabled="readonly"
                      icon="mdi-delete-outline"
                      @click="() => removeGroupItem(groupIdx, itemIdx)"
                    ></v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </v-card-text>
            <v-card-actions v-if="!readonly" class="mt-auto">
              <v-btn
                block
                tonal
                color="primary"
                @click="() => addGroupItem(groupIdx)"
              >
                Add Item
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col cols="6" v-if="!readonly">
          <v-card
            min-height="200"
            @click="addGroup"
            variant="tonal"
            color="primary"
            class="fill-height d-flex align-center justify-center flex-column"
          >
            <v-icon icon="mdi-plus-circle-outline" size="100" />
            <span>Add Group</span>
          </v-card>
        </v-col>
      </v-row>
    </v-sheet>
    <v-card-actions>
      <ButtonBlock @cancel="$emit('cancel')" @submit="submit" />
    </v-card-actions>
  </v-card>
</template>

<style lang="scss">
.group-col {
  height: 100%;
}
</style>
