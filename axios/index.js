import axios from "axios";
import onRequestFullfilled from "./on-request-fullfilled";
import onResponseError from "./on-response-error";
import onResponseFulfilled from "./on-response-fullfilled";

export const createAxios = (config) => {
  const instance = axios.create(config);
  instance.interceptors.request.use((value) => onRequestFullfilled(value));
  instance.interceptors.response.use(
    (res) => onResponseFulfilled(res),
    (error) => onResponseError(error),
  );
  return instance;
};
