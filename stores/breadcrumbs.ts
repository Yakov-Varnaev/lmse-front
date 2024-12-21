import { defineStore } from "pinia";
import type { Chapter, Lesson } from "~/types";


export const useBreadcrumbs = defineStore("bread", {
	state: (): {
		chapterQueue: Chapter[],
		lessonQueue: Lesson[],
	} => ({
		chapterQueue: [],
		lessonQueue: [],
	}),
	actions: {
		setChapter(c: Chapter) {
			this.chapterQueue.push(c)
		},
		removeChapter(chapter: Chapter) {
			this.chapterQueue.push(chapter)
		},
		setLesson(l: Lesson) {
			this.lessonQueue.push(l)
		},
		removeLesson(lesson: Lesson) {
			this.lessonQueue.push(lesson)
		},
	},
	persist: true,
});
