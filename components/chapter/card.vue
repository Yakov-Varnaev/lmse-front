<script>
export default {
  props: {
    chapter: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      chapterData: this.$props.chapter,
    };
  },
  mounted() {},
};
</script>

<template>
  <v-card>
    <v-card-title>
      {{ chapterData.title }}
    </v-card-title>
  </v-card>
</template>
