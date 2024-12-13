<script setup lang="ts">
const { submitPorps } = defineProps<{
  submitPorps?: { active?: boolean; text?: string };
  cancelPorps?: { active?: boolean; text?: string };
}>();
</script>

<template>
  <v-row>
    <v-col>
      <v-btn
        :disabled="submitPorps?.active ? !submitPorps.active : false"
        block
        color="primary"
        @click="$emit('submit')"
      >
        {{ submitPorps?.text || "Submit" }}
      </v-btn>
    </v-col>
    <v-col>
      <v-btn block color="red" @click="$emit('cancel')">
        {{ cancelPorps?.text || "Cancel" }}
      </v-btn>
    </v-col>
    <v-input type="hidden" class="position-absolute" />
  </v-row>
</template>
