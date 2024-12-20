<script setup lang="ts">
const emit = defineEmits(["update"]);
const { title } = defineProps<{ title: string }>();

const isEdit = ref(false);
const newTitle = ref(title);

const toggleEdit = () => {
  isEdit.value = !isEdit.value;
};

const update = () => {
  emit("update", { title: newTitle.value });
  toggleEdit();
};

const cancel = () => {
  newTitle.value = title;
  toggleEdit();
};
</script>

<template>
  <v-row>
    <v-col>
      <v-text-field
        v-if="isEdit"
        label="Editor"
        class="mb-n5 pa-0"
        v-model.trim="newTitle"
      />
      <v-card v-else variant="tonal">
        <v-card-title>{{ title }}</v-card-title>
      </v-card>
    </v-col>
    <v-col
      cols="2"
      v-if="isEdit"
      class="d-flex align-center justify-space-evenly"
    >
      <v-btn
        icon="mdi-check"
        color="primary"
        size="small"
        variant="tonal"
        @click="update"
      />
      <v-btn
        icon="mdi-close"
        color="red"
        size="small"
        variant="tonal"
        @click="cancel"
      />
    </v-col>
    <v-col cols="1" v-else>
      <v-btn
        icon="mdi-pencil"
        color="primary"
        size="small"
        variant="tonal"
        @click="toggleEdit"
      />
    </v-col>
  </v-row>
</template>
