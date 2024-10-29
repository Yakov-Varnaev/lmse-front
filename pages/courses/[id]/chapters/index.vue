<script>
export default {
  setup() {
    definePageMeta({
      middleware: "authenticated",
      crumb: "Chapters",
    });

    return {};
  },
};
</script>

<template>
  <div>chapters</div>
</template>
