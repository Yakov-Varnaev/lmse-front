import { createAxios } from "~/axios";

const backURL = "http://127.0.0.1:8000";

export const apiv1 = createAxios({
  baseURL: backURL + "/api/v1",
});
