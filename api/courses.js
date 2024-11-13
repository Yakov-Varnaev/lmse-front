import { apiv1 } from "~/api/v1";

export const createCourse = async (data) => {
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
  return await apiv1.put(`courses/${id}/`, data);
};

export const deleteCourse = async (id) => {
  return await apiv1.delete(`courses/${id}/`);
};

export const createChapter = async (courseId, data) => {
  return await apiv1.post(`courses/${courseId}/chapters/`, data);
};

export const getChapters = async (courseId) => {
  return await apiv1.get(`courses/${courseId}/chapters/`);
};

export const retrieveChapter = async (courseId, chapterId) => {
  return await apiv1.get(`courses/${courseId}/chapters/${chapterId}/`);
};

export const updateChapter = async (courseId, chapterId, data) => {
  return await apiv1.put(`courses/${courseId}/chapters/${chapterId}/`, data);
};

export const deleteChapter = async (courseId, chapterId) => {
  return await apiv1.delete(`courses/${courseId}/chapters/${chapterId}/`);
};

// Lessons
export const createLesson = async (courseId, chapterId, data) => {
  data.description = "test";
  return await apiv1.post(
    `courses/${courseId}/chapters/${chapterId}/lessons/`,
    data,
  );
};

export const getLessons = async (courseId, chapterId) => {
  return await apiv1.get(`courses/${courseId}/chapters/${chapterId}/lessons/`);
};

export const retrieveLesssons = async (courseId, chapterId, lessonId) => {
  return await apiv1.get(
    `courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/`,
  );
};

export const updateLesson = async (courseId, chapterId, lessonId, data) => {
  return await apiv1.put(
    `courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/`,
    data,
  );
};

export const deleteLesson = async (courseId, chapterId, lessonId) => {
  return await apiv1.delete(
    `courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/`,
  );
};

// Blocks

export const createBlock = async (courseId, chapterId, lessonId, data) => {
  return await apiv1.post(
    `courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/blocks/`,
    data,
  );
};

export const getBlocks = async (courseId, chapterId, lessonId) => {
  return await apiv1.get(
    `courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/blocks/`,
  );
};

export const updateBlock = async (
  courseId,
  chapterId,
  lessonId,
  blockId,
  data,
) => {
  return await apiv1.put(
    `courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/blocks/${blockId}/`,
    data,
  );
};

export const deleteBlock = async (courseId, chapterId, lessonId, blockId) => {
  return await apiv1.delete(
    `courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/blocks/${blockId}/`,
  );
};

/* Templates */

export const getTemplates = async () => {
  return await apiv1.get("templates/");
};
