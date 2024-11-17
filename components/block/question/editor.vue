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
      if (this.data.variants.length >= 10) {
        this.alert.reportError("Maximum amount of variants achived!");
        return;
      }
      let id = this.data.variants.length;
      this.data.variants.push({ id, text: "", correct: false });
    },
    deleteVariant(idx) {
      this.data.variants.splice(idx, 1);
      this.data.variants.map((v, i) => (v.id = i));
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

      <v-divider class="mt-4"></v-divider>

      <v-sheet class="rounded pa-2">
        <v-row
          no-gutters
          v-for="(variant, idx) in data.variants"
          align="center"
          class="mt-3"
        >
          <v-col class="d-flex" cols="1">
            <v-checkbox class="mx-auto d-flex" v-model="variant.correct" />
          </v-col>

          <v-col>
            <v-text-field
              hide-details="true"
              density="compact"
              v-model="variant.text"
              :key="variant.id"
            />
          </v-col>
          <v-col class="d-flex" cols="1">
            <v-btn
              icon="mdi-delete-outline"
              class="mx-auto"
              variant="text"
              @click="() => deleteVariant(idx)"
            >
            </v-btn>
          </v-col>
        </v-row>
        <v-row no-gutters class="mt-2">
          <v-col>
            <v-btn @click="addVariant" block variant="tonal" color="primary">
              Add variant
            </v-btn>
          </v-col>
        </v-row>
      </v-sheet>

      <v-divider class="mb-4"></v-divider>
    </v-card-text>
    <v-card-actions>
      <ButtonBlock @cancel="$emit('cancel')" @submit="submit" />
    </v-card-actions>
  </v-card>
</template>
