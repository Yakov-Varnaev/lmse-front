<template>
  <v-select
    :items="[
      { value: 'beginner', title: 'Beginner' },
      { value: 'medium', title: 'Medium' },
      { value: 'advanced', title: 'Advanced' },
    ]"
    item-value="value"
    item-title="title"
    v-bind="$attrs"
  />
</template>
