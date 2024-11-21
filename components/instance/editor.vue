<script>
export default {
  emits: ["updated", "cancel"],
  props: {
    instance: {
      type: Object,
      required: true,
    },
  },
  setup() {
    return { loader: useLoader() };
  },
  data() {
    return {
      data: { ...this.instance },
    };
  },
  methods: {
    async update() {
      this.$emit("updated", this.data);
    },
    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>

<template>
  <v-container class="bg-background editor-container">
    <v-text-field v-model.trim="data.title" />
    <VuetifyTiptap
      v-model.trim="data.description"
      class="editor bg-background"
      markdown-theme="github"
    />
    <v-row class="mt-auto">
      <v-col>
        <v-btn block color="primary" @click="update">Save</v-btn>
      </v-col>
      <v-col>
        <v-btn block color="red" @click="cancel">Cancel</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.editor-container {
  height: 100%;
}

.editor {
  position: relative;
}
</style>
