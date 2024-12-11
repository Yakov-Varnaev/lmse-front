import type { Block, Chapter, Course, CourseTree, Lesson } from "~/types";

export const createCourse = async (data: Course) => {
	const { $apiv1: apiv1 } = useNuxtApp();
	return await apiv1.post("courses/", data);
};

export const getCourses = async (params = { my: null, author: null }) => {
	const { $apiv1: apiv1 } = useNuxtApp();
	let parsedParams: { my?: boolean, owner?: string } = {};
	if (params.my === true) {
		parsedParams.my = true;
	}
	if (params.author) {
		parsedParams.owner = params.author;
	}
	return await apiv1.get("courses/", { params: parsedParams });
};

export const retrieveCourse = async (id: string) => {
	const { $apiv1: apiv1 } = useNuxtApp();
	return await apiv1.get(`courses/${id}/`);
};

export const retrieveCourseTree = async (id: string): Promise<{ data: CourseTree }> => {
	const { $apiv1: apiv1 } = useNuxtApp();
	return await apiv1.get(`courses/${id}/tree/`);
};

export const updateCourse = async (id: string, data: Course) => {
	const { $apiv1: apiv1 } = useNuxtApp();
	return await apiv1.put(`courses/${id}/`, data);
};

export const publishCourse = async (id: string) => {
	const { $apiv1: apiv1 } = useNuxtApp();
	return await apiv1.put(`courses/${id}/publish/`);
};

export const checkCourse = async (id: string) => {
	const { $apiv1: apiv1 } = useNuxtApp();
	return await apiv1.get(`courses/${id}/check/`);
};

export const deleteCourse = async (id: string) => {
	const { $apiv1: apiv1 } = useNuxtApp();
	return await apiv1.delete(`courses/${id}/`);
};

export const enrollCourse = async (id: string) => {
	const { $apiv1: apiv1 } = useNuxtApp();
	return await apiv1.post(`courses/${id}/students/`);
};

/* chapters */

export const createChapter = async (courseId: string, data: Chapter) => {
	const { $apiv1: apiv1 } = useNuxtApp();
	return await apiv1.post(`courses/${courseId}/chapters/`, data);
};

export const getChapters = async (courseId: string): Promise<Chapter[]> => {
	const { $apiv1: apiv1 } = useNuxtApp();
	return await apiv1.get(`courses/${courseId}/chapters/`);
};

export const retrieveChapter = async (courseId: string, chapterId: string): Promise<Chapter> => {
	const { $apiv1: apiv1 } = useNuxtApp();
	return await apiv1.get(`courses/${courseId}/chapters/${chapterId}/`);
};

export const updateChapter = async (courseId: string, chapterId: string, data: Chapter): Promise<Chapter> => {
	const { $apiv1: apiv1 } = useNuxtApp();
	return await apiv1.put(`courses/${courseId}/chapters/${chapterId}/`, data);
};

export const deleteChapter = async (courseId: string, chapterId: string): Promise<any> => {
	const { $apiv1: apiv1 } = useNuxtApp();
	return await apiv1.delete(`courses/${courseId}/chapters/${chapterId}/`);
};

// Lessons
export const createLesson = async (courseId: string, chapterId: string, data: Lesson) => {
	const { $apiv1: apiv1 } = useNuxtApp();
	data.description = "test";
	return await apiv1.post(
		`courses/${courseId}/chapters/${chapterId}/lessons/`,
		data,
	);
};

export const getLessons = async (courseId, chapterId) => {
	const { $apiv1: apiv1 } = useNuxtApp();
	return await apiv1.get(`courses/${courseId}/chapters/${chapterId}/lessons/`);
};

export const retrieveLesson = async (courseId, chapterId, lessonId) => {
	const { $apiv1: apiv1 } = useNuxtApp();
	return await apiv1.get(
		`courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/`,
	);
};

export const updateLesson = async (courseId, chapterId, lessonId, data) => {
	const { $apiv1: apiv1 } = useNuxtApp();
	return await apiv1.put(
		`courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/`,
		data,
	);
};

export const deleteLesson = async (courseId, chapterId, lessonId) => {
	const { $apiv1: apiv1 } = useNuxtApp();
	return await apiv1.delete(
		`courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/`,
	);
};

// Blocks

export const createBlock = async (courseId, chapterId, lessonId, data) => {
	const { $apiv1: apiv1 } = useNuxtApp();
	return await apiv1.post(
		`courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/blocks/`,
		data,
	);
};

export const getBlocks = async (courseId, chapterId, lessonId) => {
	const { $apiv1: apiv1 } = useNuxtApp();
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
	const { $apiv1: apiv1 } = useNuxtApp();
	return await apiv1.put(
		`courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/blocks/${blockId}/`,
		data,
	);
};

export const deleteBlock = async (courseId: string, chapterId: string, lessonId: string, blockId: string): Promise<any> => {
	const { $apiv1: apiv1 } = useNuxtApp();
	return await apiv1.delete(
		`courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/blocks/${blockId}/`,
	);
};

export const uploadBlockMedia = async (
	courseId: string,
	chapterId: string,
	lessonId: string,
	blockId: string,
	data: any,
): Promise<any> => {
	const { $apiv1: apiv1 } = useNuxtApp();
	return await apiv1.post(
		`courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/blocks/${blockId}/media/`,
		data,
	);
};

export const deleteBlockMedia = async (
	courseId: string,
	chapterId: string,
	lessonId: string,
	blockId: string,
	mediaId: string,
): Promise<any> => {
	const { $apiv1: apiv1 } = useNuxtApp();
	return await apiv1.delete(
		`courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/blocks/${blockId}/media/${mediaId}/`,
	);
}

/* Templates */

export const getTemplates = async () => {
	const { $apiv1: apiv1 } = useNuxtApp();
	return await apiv1.get("templates/");
};

/* Answers */
export const createAnswer = async (
	courseId,
	chapterId,
	lessonId,
	blockId,
	data,
	fake = null,
) => {
	const { $apiv1: apiv1 } = useNuxtApp();
	const params = {};
	if (fake) {
		params.fake = fake;
	}
	return await apiv1.post(
		`courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/blocks/${blockId}/answers/`,
		data,
		{ params },
	);
};

export const getAnswers = async (courseId, chapterId, lessonId) => {
	const { $apiv1: apiv1 } = useNuxtApp();
	return await apiv1.get(
		`courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/answers/`,
	);
};
