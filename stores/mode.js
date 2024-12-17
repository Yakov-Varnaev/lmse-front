import { defineStore } from "pinia";

export const useMode = defineStore("store/mode", {
  state: () => ({
    edit: false,
  }),
  actions: {
    toggle_edit() {
      this.edit = !this.edit;
    },
  },
  persist: true,
});
