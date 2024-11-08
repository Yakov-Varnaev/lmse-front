import { apiv1 } from "~/api/v1";

export const createCourse = async (data) => {
  console.log(data);
  return await apiv1.post("courses/", data);
};

export const getCourses = async (params = { my: null, author: null }) => {
  let parsedParams = {};
  if (params.my === true) {
    parsedParams.my = true;
  }
  if (params.author) {
    parsedParams.author = params.author;
  }
  return await apiv1.get("courses/", { params: parsedParams });
};

export const retrieveCourse = async (id) => {
  return await apiv1.get(`courses/${id}/`);
};

export const updateCourse = async (id, data) => {
  console.log(id);
  console.log(data);
  return await apiv1.put(`courses/${id}/`, data);
};

export const getChapters = async (courseId) => {
  return await apiv1.get(`courses/${courseId}/chapters/`);
};

export const retrieveChapter = async (courseId, chapterId) => {
  return await apiv1.get(`courses/${courseId}/chapters/${chapterId}/`);
};
