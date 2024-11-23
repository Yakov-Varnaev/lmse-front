import { defineStore } from "pinia";

export const useLoader = defineStore("loader", {
  state: () => ({
    loading: false,
    loaderMap: {},
  }),
  actions: {
    startKeyLoading(key) {
      this.loaderMap[key] = true;
    },
    stopKeyLoading(key) {
      this.loaderMap[key] = false;
    },
    async withLoader(func, ...args) {
      this.startLoading();
      let res = await func(...args);
      this.stopLoading();
      return res;
    },
    startLoading() {
      this.loading = true;
    },
    stopLoading() {
      this.loading = false;
    },
  },
});
