import { defineStore } from "pinia";
import { login as apiLogin, getMe, refreshToken } from "~/api/auth";

const REFRESH_INTERVAL = 1000 * 60 * 5;

const initialState = () => ({
  access: null,
  refresh: null,
  loggedIn: false,
  user: null,
  lastRefresh: null,
});

export const useAuth = defineStore("auth", {
  state: initialState,
  getters: {
    getAccess(state) {
      return state.access;
    },
    getFullName(state) {
      return `${state.user?.firstName} ${state.user?.lastName}`;
    },
  },
  actions: {
    reset() {
      Object.assign(this, initialState());
    },
    async _login(loginData, report = true) {
      const alerts = useAlert();
      try {
        const { data } = await apiLogin(loginData);
        this.access = data.access;
        this.refresh = data.refresh;
        this.loggedIn = true;
        this.startRefreshTask();
        if (report) {
          alerts.reportInfo("Добро пожаловать!");
        }
        this.lastRefresh = Date.now();
      } catch (e) {
        console.log(e);
        let response = e.response;
        if (response.status === 400) {
          return { errors: response.data };
        } else if (response.status === 401) {
          alerts.reportError("Неверный логин или пароль");
          return {};
        }
      }
      if (!this.loggedIn) {
        alerts.reportError(
          "У сервера синдром вахтера, он не хочет вас пускать :(",
        );
        return {};
      }
      await this.getMe();
      navigateTo({ name: "index" });
      return {};
    },
    async refreshToken() {
      const alerts = useAlert();
      alerts.reportDev("Refreshing...");
      try {
        const { data } = await refreshToken(this.refresh);
        this.access = data.access;
        this.loggedIn = true;
        alerts.reportDev("Access token obtained!");
        this.lastRefresh = Date.now();
      } catch (error) {
        this.reset();
        alerts.reportError("Не могу обновить токен: " + error.message);
      }
    },
    startRefreshTask() {
      this.refreshInterval = setInterval(() => {
        if (
          this.loggedIn &&
          Date.now() - this.lastRefresh > REFRESH_INTERVAL &&
          this.refresh
        ) {
          this.refreshToken();
        }
      }, REFRESH_INTERVAL);
    },
    async login(loginData) {
      const loader = useLoader();
      loader.startLoading();
      let resp = await this._login(loginData);
      loader.stopLoading();
      return resp;
    },
    async getMe() {
      const alerts = useAlert();
      try {
        const { data } = await getMe();
        this.user = data;
      } catch (error) {
        alerts.reportError("Не могу найти вашу карточку: " + error.message);
      }
    },
  },
  persist: true,
});
