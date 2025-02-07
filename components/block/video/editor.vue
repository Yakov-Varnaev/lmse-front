<script lang="ts" setup>
import { uploadBlockMedia } from "~/api/courses";
import type { Block, VideoBlockMeta } from "~/types";

const emit = defineEmits(["update", "cancel"]);
const { block } = defineProps<{
  block: Block<VideoBlockMeta>;
}>();

const courseId = inject<string>("courseId")!;
const chapterId = inject<string>("chapterId")!;
const lessonId = inject<string>("lessonId")!;

const data = reactive<Block<VideoBlockMeta>>(deepCopy(block));

const file = ref<File | null>(null);
const fileUrl = ref("");
const updateFile = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (!target.files) return;
  const newFile = target.files[0];
  file.value = newFile;

  fileUrl.value = URL.createObjectURL(newFile);
};

const submit = async () => {
  if (file.value) {
    const fd = new FormData();
    fd.append("file", file.value);
    const { data: fileData } = await uploadBlockMedia(
      courseId,
      chapterId,
      lessonId,
      block.id,
      fd,
    );
    data.meta.video = { src: fileData.file, id: fileData.id };
  }
  emit("update", data.meta);
};
</script>

<template>
  <v-card>
    <v-card-text>
      <v-hover v-slot="{ isHovering, props }">
        <v-card v-bind="props" tile>
          <v-overlay
            contained
            :model-value="!!isHovering"
            class="justify-center align-center"
          >
            <div>
              <label for="vidio-input" class="ma-auto">
                <v-btn
                  @click="$refs.videoInput.click()"
                  icon
                  size="150"
                  variant="tonal"
                  color="white"
                >
                  <v-icon icon="mdi-upload" size="100" />
                </v-btn>
              </label>
              <input
                ref="videoInput"
                type="file"
                @change="updateFile"
                id="video-input"
                accept="video/mp4"
              />
            </div>
          </v-overlay>
          <VideoPlayer :src="data.meta.video?.src || fileUrl" />
        </v-card>
      </v-hover>
    </v-card-text>
    <v-card-text>
      <v-text-field
        v-model="data.meta.title"
        label="Video Title"
        class="mt-2"
      />
    </v-card-text>
    <v-card-actions>
      <ButtonBlock @cancel="$emit('cancel')" @submit="submit" />
    </v-card-actions>
  </v-card>
</template>

<style lang="scss" scoped>
#video-input {
  position: absolute;
  visibility: hidden;
  width: 200;
  height: 200;
}
</style>
