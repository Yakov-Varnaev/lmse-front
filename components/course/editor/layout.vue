<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="3">
        <v-responsive
          aspect-ratio="1/1"
          class="overflow-hidden course-card-top rounded-xl"
        >
          <slot name="top-left" />
        </v-responsive>
      </v-col>
      <v-col cols="6">
        <slot name="top-right" />
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="9">
        <slot name="bottom" />
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.course-card-top {
  aspect-ratio: 1 / 1;
}
</style>
