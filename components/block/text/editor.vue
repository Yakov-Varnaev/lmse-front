<script>
export default {
  emits: ["update", "cancel"],
  props: {
    block: { type: Object, required: true },
  },
  data() {
    return { data: { ...this.block } };
  },
  methods: {
    submit() {
      this.$emit("update", this.data);
    },
  },
};
</script>
<template>
  <v-card>
    <VuetifyTiptap
      v-model.trim="data.content"
      max-height="700"
      class="editor bg-background"
      markdown-theme="github"
    />
    <v-card-actions>
      <ButtonBlock @cancel="$emit('cancel')" @submit="submit" />
    </v-card-actions>
  </v-card>
</template>
