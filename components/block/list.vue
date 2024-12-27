<script setup lang="ts">
import { deleteBlock, updateBlock } from "~/api/courses";
import {
  BlockConnection,
  BlockGroupDistribution,
  BlockOpenQuestion,
  BlockOrdering,
  BlockQuestion,
  BlockText,
  BlockTrueFalse,
  BlockVideo,
} from "#components";
import type { Block } from "~/types";

const emit = defineEmits(["update", "refetch", "delete"]);
const { courseId, chapterId, lessonId, editMode, blocks } = defineProps<{
  courseId: string;
  chapterId: string;
  lessonId: string;
  editMode: boolean;
  blocks: Block<any>[];
}>();

provide("courseId", courseId);
provide("chapterId", chapterId);
provide("lessonId", lessonId);

const drag = ref(false);

const componentMap: { [key: string]: Component } = {
  text: BlockText,
  question: BlockQuestion,
  connection: BlockConnection,
  "open-question": BlockOpenQuestion,
  ordering: BlockOrdering,
  "true-false": BlockTrueFalse,
  "group-distribution": BlockGroupDistribution,
  video: BlockVideo,
};
const deleteDialog = ref(false);
const blockToDelete = ref<string | null>(null);

const appendBlock = () => {
  // TODO: no need to refetch actually
  emit("refetch");
};

async function updateBlockContent(block: Block<any>, newMeta: any) {
  block.meta = newMeta;
  const { data } = await updateBlock(
    courseId,
    chapterId,
    lessonId,
    block.id,
    block,
  );
  emit("update", data);
}
const toggleDeleteDialog = () => {
  deleteDialog.value = !deleteDialog.value;
};
async function onBlockDelete(id: string) {
  blockToDelete.value = id;
  toggleDeleteDialog();
}
const performBlockDelete = async () => {
  await deleteBlock(courseId, chapterId, lessonId, blockToDelete.value!);
  emit("delete", blockToDelete.value);
  toggleDeleteDialog();
};
async function moveUp(idx: number) {
  if (idx === 0) {
    return;
  }
  const oldBlock = blocks[idx];
  await updateBlock(courseId, chapterId, lessonId, oldBlock.id, {
    ...oldBlock,
    order: idx - 1,
  });
  [blocks[idx], blocks[idx - 1]] = [blocks[idx - 1], blocks[idx]];
}
async function moveDown(idx: number) {
  if (idx === blocks.length - 1) {
    return;
  }
  drag.value = true;
  setTimeout(() => (drag.value = false), 200);
  const oldBlock = blocks[idx];
  await updateBlock(courseId, chapterId, lessonId, oldBlock.id, {
    ...oldBlock,
    order: idx + 1,
  });
  [blocks[idx], blocks[idx + 1]] = [blocks[idx + 1], blocks[idx]];
}

onMounted(() => {
  setTimeout(() => {
    const bid = useRoute().query.blockId;
    if (!bid) return;
    const block = document.getElementById(bid.toString());
    if (!block) return;
    block.scrollIntoView({ behavior: "smooth" });
    let route = useRoute();
    let query = { ...route.query };
    delete query.blockId;
    useRouter().replace({ query: { ...query } });
  }, 300);
});
</script>

<template>
  <div>
    <v-dialog v-model="deleteDialog">
      <v-row justify="center">
        <v-col cols="3">
          <v-card>
            <v-card-text>Are you sure?</v-card-text>
            <v-card-actions>
              <ButtonBlock
                :submit-porps="{ text: 'Yes' }"
                :cancel-porps="{ text: 'No' }"
                @cancel="toggleDeleteDialog"
                @submit="performBlockDelete"
              />
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-dialog>
    <div class="mt-2">
      <div v-for="(block, idx) in blocks" :key="block.id">
        <v-hover v-if="editMode">
          <template #default="{ isHovering, props }">
            <div v-bind="props" class="py-3">
              <v-divider>
                <BlockCreateDialog
                  :course-id="courseId"
                  :chapter-id="chapterId"
                  :lesson-id="lessonId"
                  :order="block.order"
                  @created="appendBlock"
                  v-if="editMode"
                >
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      :prepend-icon="
                        idx === 0
                          ? 'mdi-arrow-expand-down'
                          : 'mdi-arrow-split-horizontal'
                      "
                      size="s"
                      :class="{
                        'small-btn-text': true,
                        'pa-1': true,
                      }"
                    >
                      <span v-if="isHovering" class="ml-1">Insert</span>
                    </v-btn>
                  </template>
                </BlockCreateDialog>
              </v-divider>
            </div>
          </template>
        </v-hover>

        <component
          :id="block.id"
          class="fill-width"
          :is="{ ...componentMap[block.kind] }"
          :block="block"
          :editMode="editMode"
          :isFirst="idx === 0"
          :isLast="idx === blocks.length - 1"
          @update="updateBlockContent"
          @delete="onBlockDelete"
          @up="async () => await moveUp(idx)"
          @down="async () => await moveDown(idx)"
        />
      </div>
    </div>

    <BlockCreateDialog
      :course-id="courseId"
      :chapter-id="chapterId"
      :lesson-id="lessonId"
      @created="appendBlock"
      v-if="editMode"
    >
      <template #activator="{ props }">
        <v-card
          v-bind="props"
          variant="tonal"
          color="primary"
          elevation="0"
          class="mt-4 pa-5"
        >
          <v-row align="center" no-gutters>
            <v-col class="text-center"><span>Add Block</span></v-col>
          </v-row>
        </v-card>
      </template>
    </BlockCreateDialog>
  </div>
</template>

<style scoped lang="scss">
.small-btn-text {
  font-size: 9px;
}
</style>
