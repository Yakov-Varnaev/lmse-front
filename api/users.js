export const retrieveUser = async (id) => {
  const { $apiv1: apiv1 } = useNuxtApp();
  return await apiv1.get(`auth/users/${id}/`);
};

export const getUsers = async (page, pageSize) => {
  const { $apiv1: apiv1 } = useNuxtApp();
  return await apiv1.get("/", {
    params: { page: page, page_size: pageSize },
  });
};

export const updateMe = async (data) => {
  const { $apiv1: apiv1 } = useNuxtApp();
  return await apiv1.patch("auth/users/me/", data);
};
