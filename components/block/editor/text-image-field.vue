<script setup lang="ts">
import { uploadBlockMedia } from "~/api/courses";
import type { Block, TextImageVariant } from "~/types";

const { block, variant } = defineProps<{
  block: Block<any>;
  id: string;
  variant: TextImageVariant;
}>();

const courseId = inject<string>("courseId")!;
const chapterId = inject<string>("chapterId")!;
const lessonId = inject<string>("lessonId")!;

const emit = defineEmits(["updateFile"]);

const updateFile = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (!target.files) return;
  const newfile = target.files[0];

  const fd = new FormData();
  fd.append("file", newfile);
  const { data: fileData } = await uploadBlockMedia(
    courseId,
    chapterId,
    lessonId,
    block.id,
    fd,
  );

  variant.image = { src: fileData.file, id: fileData.id };
};
</script>

<template>
  <div class="d-flex align-center">
    <v-text-field
      v-bind="$attrs"
      v-if="!variant.image"
      hide-details
      density="compact"
      v-model="variant.text"
      :key="variant.id"
    >
    </v-text-field>

    <v-card v-else variant="flat" class="d-flex" width="100%" max-height="200">
      <v-img :src="`http://localhost:8000${variant.image.src}`" />
    </v-card>

    <div>
      <v-btn icon flat @click.stop :readonly="!!$attrs.readonly">
        <label :for="id">
          <v-icon icon="mdi-image" />
        </label>
      </v-btn>
      <input
        type="file"
        @change="updateFile"
        :id="id"
        class="image-input"
        accept="image/*"
      />
    </div>
  </div>
</template>
