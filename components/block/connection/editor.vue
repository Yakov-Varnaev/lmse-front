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
      this.data.variants.push({
        left: { id, text: "" },
        right: { id, text: "" },
      });
    },
    deleteVariant(idx) {
      this.data.variants.splice(idx, 1);
      this.data.variants.map((v, i) => {
        v.left.id = i;
        v.right.id = i;
      });
    },
  },
};
</script>

<template>
  <v-card>
    <v-card-text>
      <VuetifyTiptap
        v-model="data.text"
        class="bg-background"
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
          <v-col class="mr-1">
            <v-text-field
              hide-details
              density="compact"
              v-model="variant.left.text"
            />
          </v-col>

          <v-col cols="1" class="d-flex">
            <v-icon icon="mdi-record" class="pa-0 ma-0 ml-2" />
            <v-icon icon="mdi-minus" class="pa-0 ma-0 mr-n2 ml-n3" />
            <v-icon icon="mdi-minus" class="pa-0 ma-0 ml-n2 mr-n3" />
            <v-icon icon="mdi-record" class="pa-0 ma-0 mr-2" />
          </v-col>

          <v-col>
            <v-text-field
              hide-details
              class="ml-1"
              density="compact"
              v-model="variant.right.text"
            />
          </v-col>

          <v-col class="d-flex" cols="1">
            <v-btn
              variant="text"
              class="mx-auto"
              icon="mdi-delete-outline"
              @click="() => deleteVariant(idx)"
            />
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

      <v-divider class="mt-2"></v-divider>
    </v-card-text>
    <v-card-actions>
      <ButtonBlock @cancel="$emit('cancel')" @submit="submit" />
    </v-card-actions>
  </v-card>
</template>
