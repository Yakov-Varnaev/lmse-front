import { useAuth } from "~/stores/auth";
import { cloneDeep } from "lodash";
import decamelizeKeys from "decamelize-keys";

const requestCaseMiddleware = (data, enable = true) =>
  enable ? decamelizeKeys(data, { deep: true }) : data;

export default (request) => {
  const auth = useAuth();

  request = cloneDeep(request);
  request.headers = request.headers || {};

  if (auth.getAccess) {
    request.headers.Authorization = `Bearer ${auth.getAccess}`;
  }

  if (!(request.data instanceof FormData)) {
    request.data = requestCaseMiddleware(request.data);
  }

  return request;
};
