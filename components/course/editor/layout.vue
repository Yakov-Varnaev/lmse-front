<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="3">
        <v-responsive
          aspect-ratio="1/1"
          class="overflow-hidden course-card-top"
        >
          <v-img
            v-if="false"
            class="rounded-xl"
            src="https://cdn.vuetifyjs.com/images/cards/house.jpg"
            cover
            width="100%"
            aspect-ratio="1/1"
          />
          <v-card
            variant="tonal"
            class="fill-height rounded-xl d-flex"
            color="primary"
          >
            <v-icon icon="mdi-image-off-outline" class="ma-auto" size="150" />
          </v-card>
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
