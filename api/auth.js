import { apiv1 } from "~/api/v1";

export const login = async (loginData) => {
  const response = await apiv1.post("/auth/jwt/create/", loginData);
  return response;
};

export const getMe = async () => {
  return await apiv1.get("/auth/users/me/");
};

export const refreshToken = async (refresh) => {
  const response = await apiv1.post("/auth/jwt/refresh/", { refresh });
  return response;
};
