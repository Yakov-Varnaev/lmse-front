<script>
export default {
  props: {
    title: { type: String, required: true },
    items: { type: Array, required: true },
  },
  methods: {
    itemUpdate(data) {
      this.$emit("updated", data);
    },
  },
  data() {
    return {
      drag: true,
    };
  },
};
</script>
<template>
  <v-navigation-drawer :border="0" class="bg-background mt-4">
    <v-list-item class="pa-3 bg-primary border rounded-e-lg">
      <div class="d-flex align-center">
        <h1>{{ $props.title }}</h1>
        <slot name="actionButton" />
      </div>
    </v-list-item>

    <draggable
      :list="items"
      item-key="id"
      @update="itemUpdate"
      handle=".handle"
    >
      <template v-slot:item="{ element }">
        <v-list-item :to="element.to">
          <template #prepend>
            <v-btn
              size="xs"
              icon
              elevation="0"
              class="mr-2 pa-1"
              color="background"
            >
              <v-icon
                size="xs"
                icon="mdi-menu"
                color="primary"
                class="handle"
              />
            </v-btn>
          </template>
          <v-list-item-title>
            {{ element.title }}
          </v-list-item-title>
          <template #append>
            <v-icon icon="mdi-circle-outline" size="xs" color="grey" />
          </template>
        </v-list-item>
      </template>
    </draggable>
  </v-navigation-drawer>
</template>
