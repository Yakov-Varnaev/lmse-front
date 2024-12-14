<template>
  <v-select
    v-bind="$attrs"
    label="Value"
    density="compact"
    item-value="value"
    item-title="text"
    hide-selected
    variant="solo"
    :items="[
      { text: 'True', value: 'true' },
      { text: 'False', value: 'false' },
      { text: 'Unknown', value: 'unknown' },
    ]"
  />
</template>
