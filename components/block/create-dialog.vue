<script>
import { createBlock, getTemplates } from "~/api/courses";

export default {
  props: {
    courseId: { type: String, required: true },
    chapterId: { type: String, required: true },
    lessonId: { type: String, required: true },
  },
  data() {
    return {
      templateMap: templateTitleMap,
      isOpen: false,
      options: [],
      template: null,
    };
  },
  methods: {
    toggle() {
      this.template = null;
      this.isOpen = !this.isOpen;
    },
    async loadTemplates() {
      const { data } = await getTemplates();
      let processedData = data.map((t) => {
        return {
          ...t,
          title: this.templateMap[t.kind].title,
          subtitle: this.templateMap[t.kind].subtitle,
        };
      });
      this.options = processedData;
    },
    async createBlock() {
      const { data } = await createBlock(
        this.courseId,
        this.chapterId,
        this.lessonId,
        { template: this.template.id },
      );
      this.created(data);
    },
    created(newChapter) {
      this.$emit("created", newChapter);
      this.toggle();
    },
  },
  async mounted() {
    this.loadTemplates();
  },
  unmounted() {},
};
</script>

<template>
  <v-dialog v-model="isOpen" max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
      <slot name="activator" :props="activatorProps" />
    </template>
    <template v-slot:default>
      <v-card>
        <v-card-title>Add Block</v-card-title>
        <v-card-text>
          <v-combobox
            :items="options"
            v-model="template"
            item-props
            return-object
          >
          </v-combobox>
        </v-card-text>
        <v-card-actions>
          <ButtonBlock
            @cancel="toggle"
            @submit="createBlock"
            :submit-porps="{ active: !!template }"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
