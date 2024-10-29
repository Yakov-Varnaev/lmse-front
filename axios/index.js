import axios from "axios";
import onRequestFullfilled from "./onRequestFullfilled";
import onResponseError from "./onResponseError";
import onResponseFulfilled from "./onResponseFullfilled";

export const createAxios = (config) => {
  const instance = axios.create(config);
  instance.interceptors.request.use((value) => onRequestFullfilled(value));
  instance.interceptors.response.use(
    (res) => onResponseFulfilled(res),
    (error) => onResponseError(error),
  );
  return instance;
};
