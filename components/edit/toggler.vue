<script setup>
const props = defineProps({
  absolute: { type: Boolean, default: false },
});

const mode = useMode();
const context = useCourseContext();
</script>

<template>
  <div :id="absolute ? 'mode-container' : ''" v-if="context.isOwner">
    <v-btn
      v-bind="$attrs"
      @click="mode.toggle_edit"
      :class="{ 'mode-toggler': props.absolute }"
    >
      {{ mode.edit ? "Normal Mode" : "Edit Mode" }}
    </v-btn>
  </div>
</template>

<style lang="scss">
#mode-container {
  position: absolute;
  top: 0;
  right: 0;
  width: 20%;
  display: flex;
  height: 100%;
  pointer-events: none;
}

.mode-toggler {
  position: sticky;
  top: 90px;
  right: 50px;
  margin: 15px 15px;
  z-index: 10000;
  pointer-events: all;
}
</style>
