import { retrieveUser, getUsers } from "~/api/users";

export const useUsers = defineStore("users", {
  actions: {
    async getUsers(page, pageSize) {
      const alert = useAlert();
      try {
        const response = await getUsers(page, pageSize);
        return response.data;
      } catch (e) {
        alert.reportError(e.message);
      }
    },
    async retrieveUser(userId) {
      const alert = useAlert();
      try {
        const response = await retrieveUser(userId);
        return response.data;
      } catch (e) {
        alert.reportError(e.message);
      }
    },
  },
});
