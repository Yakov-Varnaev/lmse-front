<script setup lang="ts">
import { uploadBlockMedia } from "~/api/courses";
import type { Block, ConnectionBlockMeta } from "~/types";

const props = defineProps<{ block: Block<ConnectionBlockMeta> }>();

const alert = useAlert();

const courseId = inject("courseId");
const chapterId = inject("chapterId");
const lessonId = inject("lessonId");

const getImageId = (id: number, side: string): string => {
  return `${props.block.id}-${id}-${side}-image`;
};

const data = reactive<Block<ConnectionBlockMeta>>({ ...props.block });

const updateFile = async (id: number, side: string, e: Event) => {
  const target = e.target as HTMLInputElement;
  if (!target.files) return;
  const newfile = target.files[0];

  const fd = new FormData();
  fd.append("file", newfile);
  const { data: fileData } = await uploadBlockMedia(
    courseId,
    chapterId,
    lessonId,
    props.block.id,
    fd,
  );

  data.meta.variants[id][side].image = { src: fileData.file, id: fileData.id };
  console.log(data);
};

const emit = defineEmits(["update", "cancel"]);

const submit = () => {
  emit("update", data.meta);
};

const addVariant = (): void => {
  if (data.meta.variants.length >= 10) {
    alert.reportError("Maximum amount of variants achived!");
    return;
  }
  let id = data.meta.variants.length;
  data.meta.variants.push({
    left: { id, text: "" },
    right: { id, text: "" },
  });
};

const deleteVariant = (idx: number): void => {
  data.meta.variants.splice(idx, 1);
  data.meta.variants.map((v, i) => {
    v.left.id = i;
    v.right.id = i;
  });
};
</script>

<template>
  <v-card>
    <v-card-text>
      <VuetifyTiptap
        v-model="data.meta.text"
        class="bg-background"
        markdown-theme="github"
      />

      <v-divider class="mt-4"></v-divider>

      <v-sheet class="rounded pa-2">
        <v-row
          no-gutters
          v-for="(variant, idx) in data.meta.variants"
          align="center"
          class="mt-3"
          justify="center"
        >
          <v-col cols="5">
            <v-text-field
              v-if="!variant.left.image"
              hide-details
              density="compact"
              v-model="variant.left.text"
              :key="variant.left.id"
            >
              <template #append>
                <div>
                  <v-btn icon flat @click.stop>
                    <label :for="getImageId(variant.left.id, 'left')">
                      <v-icon icon="mdi-image" />
                    </label>
                  </v-btn>
                  <input
                    type="file"
                    @change="
                      async (e: Event) =>
                        await updateFile(variant.left.id, 'left', e)
                    "
                    :id="getImageId(variant.left.id, 'left')"
                    class="image-input"
                    accept="image/*"
                  />
                </div>
              </template>
            </v-text-field>
            <v-card v-else variant="flat" class="d-flex justify-center">
              <img
                :src="`http://localhost:8000/${variant.left.image.src}`"
                width="100%"
              />
            </v-card>
          </v-col>

          <v-col cols="1" class="d-flex align-center justify-center">
            <v-icon icon="mdi-arrow-left-right" />
          </v-col>

          <v-col cols="5">
            <v-text-field
              v-if="!variant.right.image"
              hide-details
              density="compact"
              v-model="variant.right.text"
              :key="variant.right.id"
            >
              <template #append>
                <div>
                  <v-btn icon flat>
                    <label :for="getImageId(variant.right.id, 'right')">
                      <v-icon icon="mdi-image" />
                    </label>
                  </v-btn>
                  <input
                    type="file"
                    @change="
                      async (e: Event) =>
                        await updateFile(variant.right.id, 'right', e)
                    "
                    :id="getImageId(variant.right.id, 'right')"
                    class="image-input"
                    accept="image/*"
                  />
                </div>
              </template>
            </v-text-field>
            <v-card v-else variant="flat" class="d-flex justify-center">
              <img
                :src="`http://localhost:8000/${variant.right.image.src}`"
                width="100%"
              />
            </v-card>
          </v-col>

          <v-col class="d-flex" cols="1">
            <v-btn
              variant="text"
              class="mx-auto"
              icon="mdi-delete-outline"
              @click="() => deleteVariant(idx)"
            />
          </v-col>
        </v-row>

        <v-row no-gutters class="mt-2">
          <v-col>
            <v-btn @click="addVariant" block variant="tonal" color="primary">
              Add variant
            </v-btn>
          </v-col>
        </v-row>
      </v-sheet>

      <v-divider class="mt-2"></v-divider>
    </v-card-text>
    <v-card-actions>
      <ButtonBlock @cancel="$emit('cancel')" @submit="submit" />
    </v-card-actions>
  </v-card>
</template>
