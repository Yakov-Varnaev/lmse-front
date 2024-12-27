<script setup lang="ts">
defineProps<{ tags: string[] }>();
</script>

<template>
  <div>
    <v-chip
      v-for="tag in tags"
      class="ma-1"
      :color="getRandom(['primary', 'warning', 'error', 'info', 'yellow'])"
    >
      {{ tag }}
    </v-chip>
  </div>
</template>
