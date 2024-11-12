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
    addVariant() {
      let id = this.data.variants.length;
      this.data.variants.push({ id, text: "", correct: false });
      console.log(this.data.variants);
    },
    deleteVariant(id) {
      this.data.variants = this.data.variants.filter((v) => v.id !== id);
    },
  },
};
</script>
<template>
  <v-card variant="outlined">
    <v-card-text>
      <VuetifyTiptap
        v-model.trim="data.text"
        class="editor bg-background"
        markdown-theme="github"
      />

      <v-sheet class="rounded pa-2 mt-2 bg-surface-light">
        <v-row
          no-gutters
          v-for="variant in data.variants"
          align="center"
          class="mt-3"
        >
          <v-col>
            <v-text-field
              hide-details="true"
              density="compact"
              v-model="variant.text"
              :key="variant.id"
            />
          </v-col>
          <v-col class="d-flex" cols="1">
            <v-checkbox class="mx-auto d-flex" v-model="variant.correct" />
          </v-col>
          <v-col class="d-flex" cols="1">
            <v-btn
              icon="mdi-delete-outline"
              class="mx-auto"
              variant="text"
              @click="() => deleteVariant(variant.id)"
            >
            </v-btn>
          </v-col>
        </v-row>
        <v-row no-gutters class="mt2">
          <v-col>
            <v-btn @click="addVariant" block variant="tonal" color="primary">
              Add variant
            </v-btn>
          </v-col>
        </v-row>
      </v-sheet>
    </v-card-text>
    <v-card-actions>
      <ButtonBlock @cancel="$emit('cancel')" @submit="submit" />
    </v-card-actions>
  </v-card>
</template>
