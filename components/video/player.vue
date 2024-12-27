<script setup lang="ts">
const video = useTemplateRef("video");
defineProps<{
  src?: string;
}>();
</script>

<template>
  <div>
    <video controls ref="video" class="player" v-if="src">
      <source
        :src="
          src ||
          'http://localhost:9000/media/blocks/d13edda8-d818-4270-9462-867aba2b8f58/b2c52960-d74d-4063-9961-9988138de922/test_video.mov'
        "
      />
    </video>

    <div v-else class="empty-video">
      <slot name="no-video">
        <v-card
          variant="tonal"
          width="100%"
          height="100%"
          class="d-flex align-center justify-center"
        >
          <v-icon icon="mdi-video-box" size="75" />
        </v-card>
      </slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.player {
  max-width: 100vw;
  width: 100%;
  padding: 0;
  margin: 0;
}

.empty-video {
  aspect-ratio: 16 / 9;
  width: 100%;
  height: 100%;
}
</style>
