<script>
export default {
  setup() {
    return { alertStore: useAlert() };
  },
  computed: {
    alerts() {
      return this.alertStore.alerts;
    },
  },
};
</script>

<template>
  <div id="alert-container-parent">
    <div id="alert-container" class="ma-5">
      <v-slide-y-reverse-transition :group="true">
        <AlertMessage
          v-for="alert in alerts"
          :type="alert.type"
          :text="alert.text"
          :key="alert.id"
          class="mt-2 notification"
          :alert="alert"
        />
      </v-slide-y-reverse-transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
#alert-container-parent {
  position: sticky;
  display: flex;
  flex-direction: row-reverse;
  bottom: 0;
  right: 0;
  pointer-events: none;
}

#alert-container {
  width: 30vw;
}
</style>
