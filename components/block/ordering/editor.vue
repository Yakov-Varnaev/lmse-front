<script>
export default {
  emits: ["update", "cancel"],
  props: {
    block: { type: Object, required: true },
  },
  setup() {
    return { alert: useAlert() };
  },
  data() {
    return {
      data: { ...this.block },
      newOption: "",
      allowPop: false,
    };
  },
  methods: {
    submit() {
      this.$emit("update", this.data);
    },
    addVariant() {
      if (this.newOption.trim().length === 0) {
        this.alert.reportInfo("Item cannot be blank!");
        return;
      }
      if (this.data.options.length >= 30) {
        this.alert.reportError("Maximum amount of items achived!");
        return;
      }
      let id = this.data.options.length;
      this.data.options.push({ id, text: this.newOption });
      this.newOption = "";
    },
    popLast() {
      if (this.newOption.length !== 0) {
        return;
      } else if (!this.allowPop) {
        this.allowPop = true;
        setTimeout(() => {
          this.allowPop = false;
        }, 350);
        return;
      }
      if (!this.allowPop) return;
      let last = this.data.options.pop();
      this.newOption = last.text;
    },
    deleteVariant(idx) {
      this.data.options.splice(idx, 1);
      this.data.options.map((v, i) => (v.id = i));
    },
  },
  watch: {
    newOption() {
      if (this.newOption.length < 2) return;
      let l = this.newOption.length;
      if (
        this.newOption.charAt(l - 1) === " " &&
        this.newOption.charAt(l - 2) === " "
      ) {
        this.newOption = this.newOption.trim();
        this.addVariant();
      }
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
        <v-row no-gutters>
          <v-card min-height="50" width="100%" color="primary" variant="tonal">
            <div v-if="data.options.length">
              <v-chip
                class="ma-2"
                color="primary"
                label
                readonly
                v-for="(option, idx) in block.options"
                :key="idx"
              >
                {{ option.text }}
                <template #append>
                  <v-icon
                    icon="mdi-close-circle"
                    size="md"
                    class="ml-2"
                    @click.stop="() => deleteVariant(idx)"
                  />
                </template>
              </v-chip>
            </div>
            <div v-else></div>
          </v-card>
        </v-row>
        <v-row no-gutters align="center" class="mt-3">
          <v-text-field
            hide-details="true"
            density="compact"
            v-on:keyup.enter="addVariant"
            v-on:keyup.backspace="popLast"
            v-model="newOption"
          />
        </v-row>
        <v-row no-gutters class="mt-2">
          <v-col>
            <v-btn @click="addVariant" block variant="tonal" color="primary">
              Add item
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
