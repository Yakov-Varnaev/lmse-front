<script setup lang="ts">
import { createBlock, getTemplates } from "~/api/courses";
import type { Block, TemplateData } from "~/types";

const emit = defineEmits(["created"]);

const { courseId, chapterId, lessonId, order } = defineProps<{
  courseId: string;
  chapterId: string;
  lessonId: string;
  order?: number;
}>();

const templateMap = templateTitleMap;
const isOpen = ref(false);
const options = ref<TemplateData[]>([]);
const template = ref<TemplateData | null>(null);
const toggle = () => {
  template.value = null;
  isOpen.value = !isOpen.value;
};

const loadTemplates = async () => {
  const { data } = await getTemplates();
  let processedData = data.map((t) => {
    return {
      ...t,
      title: templateMap[t.kind].title,
      subtitle: templateMap[t.kind].subtitle,
    };
  });
  options.value = processedData;
};
const performCreateBlock = async () => {
  let ordData: { order?: number } = {};
  if (order) {
    ordData.order = order;
  }
  const { data } = await createBlock(courseId, chapterId, lessonId, {
    template: template.value!.id,
    ...ordData,
  });
  created(data);
};

const created = (newBlock: Block<any>) => {
  emit("created", newBlock);
  toggle();
};

onMounted(async () => {
  await loadTemplates();
});
</script>

<template>
  <v-dialog v-model="isOpen" max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
      <slot name="activator" :props="activatorProps" />
    </template>
    <template v-slot:default>
      <v-card>
        <v-card-title>
          {{ $props.order ? "Insert Block" : "Add Block" }}
        </v-card-title>
        <v-card-text>
          <v-combobox
            :items="options"
            v-model="template"
            return-object
            item-props
          />
        </v-card-text>
        <v-card-actions>
          <ButtonBlock
            @cancel="toggle"
            @submit="performCreateBlock"
            :submit-porps="{ active: !!template }"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
