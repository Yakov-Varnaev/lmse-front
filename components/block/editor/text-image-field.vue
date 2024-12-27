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

const removeImage = () => {
  delete variant.image;
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
      <v-img :src="variant.image.src" cover class="rounded-xl">
        <v-btn
          variant="tonal"
          color="red"
          size="small"
          class="ma-1 img-delete-icon"
          icon="mdi-delete-outline"
          @click="removeImage"
        ></v-btn>
      </v-img>
    </v-card>
    <div>
      <v-btn
        icon
        flat
        size="small"
        class="ma-1"
        @click="$refs.uploader.click()"
      >
        <v-icon icon="mdi-image" />
      </v-btn>
      <input
        type="file"
        ref="uploader"
        @change="updateFile"
        :id="id"
        class="image-input"
        accept="image/*"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.img-delete-icon {
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>
