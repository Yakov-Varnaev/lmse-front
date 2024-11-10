<script>
export default {
  emits: ["edit"],
  props: {
    block: { type: Object, required: true },
  },
};
</script>
<template>
  <v-hover>
    <template #default="{ isHovering, props }">
      <v-card v-bind="props">
        <v-btn
          v-if="isHovering"
          class="position-absolute right-0 mt-2 mr-2"
          @click.stop="$emit('edit')"
        >
          edit
        </v-btn>
        <v-card-text>
          <div>
            {{ block.text }}
          </div>
          <div>
            <div v-for="variant in block.variants">
              <v-icon icon="mdi-circle-small" />{{ variant.text }}
            </div>
          </div>
        </v-card-text>
      </v-card>
    </template>
  </v-hover>
</template>
