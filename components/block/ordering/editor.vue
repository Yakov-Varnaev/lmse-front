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
      newOptionText: "",
      optionText: "",
      allowPop: false,
      drag: false,
      selectedOption: null,
    };
  },
  methods: {
    submit() {
      this.$emit("update", this.data);
    },
    addVariant() {
      if (this.newOptionText.trim().length === 0) {
        this.alert.reportInfo("Item cannot be blank!");
        return;
      }
      if (this.data.options.length >= 30) {
        this.alert.reportError("Maximum amount of items achived!");
        return;
      }
      let id = this.data.options.length;
      this.data.options.push({ id, text: this.newOptionText });
      this.newOptionText = "";
    },
    popLast() {
      if (this.optionText.length !== 0) {
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
      this.newOptionText = last.text;
    },
    deleteVariant(idx) {
      this.data.options.splice(idx, 1);
      this.data.options.map((v, i) => (v.id = i));
    },
    editOption(idx) {
      if (this.selectedOption === idx) {
        this.selectedOption = null;
        this.optionText = "";
        return;
      }
      this.optionText = this.data.options[idx].text;
      this.selectedOption = idx;
    },
    saveOption() {
      if (this.optionText.trim().length === 0) {
        this.alert.reportInfo("Item cannot be blank!");
        return;
      }

      this.data.options[this.selectedOption].text = this.optionText;
      this.selectedOption = null;
      this.optionText = "";
    },
  },
  watch: {
    newOption() {
      if (this.optionText.length < 2) return;
      let l = this.optionText.length;
      if (
        this.optionText.charAt(l - 1) === " " &&
        this.optionText.charAt(l - 2) === " "
      ) {
        this.optionText = this.optionText.trim();
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
          <v-checkbox v-model="data.failOnFirst" label="Fail on first" />
        </v-row>
        <v-row no-gutters>
          <v-card min-height="50" width="100%" color="primary" variant="tonal">
            <div v-if="data.options.length">
              <draggable
                animation="200"
                v-model="data.options"
                item-key="id"
                @start="drag = true"
                @end="drag = false"
              >
                <template #item="{ element: option, index: idx }">
                  <v-chip
                    :class="{
                      'ma-2': true,
                      'cursor-grab': !drag,
                      'cursor-grabbing': drag,
                    }"
                    :color="selectedOption === idx ? 'warning' : 'primary'"
                    label
                    readonly
                    @click="() => editOption(idx)"
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
                </template>
              </draggable>
            </div>
            <div v-else class="d-flex fill-height align-center pa-3">
              <span> No items yet... </span>
            </div>
          </v-card>
        </v-row>
        <v-row no-gutters align="center" class="mt-3">
          <v-text-field
            v-if="selectedOption === null"
            hide-details="true"
            density="compact"
            v-on:keyup.enter="addVariant"
            v-on:keyup.backspace="popLast"
            v-model="newOptionText"
          />
          <v-text-field
            v-else
            hide-details="true"
            density="compact"
            v-on:keyup.enter="saveOption"
            v-model="optionText"
          />
        </v-row>
        <v-row no-gutters class="mt-2">
          <v-col>
            <v-btn
              v-if="selectedOption === null"
              @click="addVariant"
              block
              variant="tonal"
              color="primary"
            >
              Add item
            </v-btn>
            <v-btn
              v-else
              @click="saveOption"
              block
              variant="tonal"
              color="primary"
            >
              Save
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
