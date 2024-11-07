import { apiv1 } from "~/api/v1";

export const createCourse = async (data) => {
  console.log(data);
  return await apiv1.post("courses/", data);
};

export const getCourses = async (my = null) => {
  let params = {};
  if (my === true) {
    params.my = true;
  }
  return await apiv1.get("courses/", { params: params });
};

export const retrieveCourse = async (id) => {
  return await apiv1.get(`courses/${id}/`);
};

export const getChapters = async (courseId) => {
  return await apiv1.get(`courses/${courseId}/chapters/`);
};

export const retrieveChapter = async (courseId, chapterId) => {
  return await apiv1.get(`courses/${courseId}/chapters/${chapterId}/`);
};
