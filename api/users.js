import { apiv1 } from "~/api/v1";

export const retrieveUser = async (id) => {
  return await apiv1.get(`auth/users/${id}/`);
};

export const getUsers = async (page, pageSize) => {
  return await apiv1.get("/", {
    params: { page: page, page_size: pageSize },
  });
};

export const updateMe = async (data) => {
  return await apiv1.patch("auth/users/me/", data);
};
