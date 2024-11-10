<script>
export default {
  props: {
    title: { type: String, required: true },
    editMode: { type: Boolean, default: false },
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
      showTooltipFor: {},
    };
  },
};
</script>
<template>
  <v-navigation-drawer :border="0">
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
        <v-list-item :to="editMode ? null : element.to">
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
            <v-hover v-if="editMode">
              <template #default="{ isHovering, props }">
                <v-btn
                  elevation="0"
                  v-bind="props"
                  icon
                  color="background"
                  size="xs"
                  class="pa-1"
                  @click="$emit('deleted', element)"
                >
                  <v-icon
                    size="xs"
                    icon="mdi-delete-outline"
                    :class="{
                      'text-red': isHovering,
                      'text-grey': !isHovering,
                    }"
                  />
                </v-btn>
              </template>
            </v-hover>
            <v-icon v-else icon="mdi-circle-outline" size="xs" color="grey" />
          </template>
        </v-list-item>
      </template>
    </draggable>
    <template #append>
      <slot name="append"></slot>
    </template>
  </v-navigation-drawer>
</template>
