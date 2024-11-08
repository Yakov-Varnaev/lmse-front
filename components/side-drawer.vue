<script>
export default {
  props: {
    title: { type: String, required: true },
    items: { type: Array, required: true },
  },
  methods: {},
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

    <v-list-item
      v-for="item in $props.items"
      :title="item.title"
      :to="item.to"
    />
  </v-navigation-drawer>
</template>
