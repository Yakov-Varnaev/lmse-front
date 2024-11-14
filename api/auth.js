export const login = async (loginData) => {
  const { $apiv1: apiv1 } = useNuxtApp();
  const response = await apiv1.post("/auth/jwt/create/", loginData);
  return response;
};

export const getMe = async () => {
  const { $apiv1: apiv1 } = useNuxtApp();
  return await apiv1.get("/auth/users/me/");
};

export const refreshToken = async (refresh) => {
  const { $apiv1: apiv1 } = useNuxtApp();
  const response = await apiv1.post("/auth/jwt/refresh/", { refresh });
  return response;
};
