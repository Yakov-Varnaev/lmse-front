import { retrieveChapter, retrieveCourse, retrieveLesson } from "~/api/courses";
import type { Chapter, Course, Lesson } from "~/types";

export const useCourseContext = defineStore("store/course-context", {
	state: (): {
		course: Course | null,
		chapter: Chapter | null,
		lesson: Lesson | null,
	} => ({
		course: null,
		chapter: null,
		lesson: null,
	}),
	actions: {
		setCourse(course: Course) {
			this.course = course;
			this.chapter = null;
			this.lesson = null;
		},
		setChapter(chapter: Chapter) {
			this.chapter = chapter;
			this.lesson = null;
		},
		setLesson(lesson: Lesson) {
			this.lesson = lesson;
		},
		async load() {
			let courseId = useRoute().params.id as string;
			if (!this.course) {
				const { data: courseData } = await retrieveCourse(courseId);
				this.setCourse(courseData);
			}

			let chapterId = useRoute().params.chapterId as string;
			if (chapterId && !this.chapter) {
				const { data: chapterData } = await retrieveChapter(courseId, chapterId);
				this.setChapter(chapterData);
			}

			let lessonId = useRoute().params.lessonId as string;
			if (lessonId && !this.lesson) {
				const { data: lessonData } = await retrieveLesson(
					courseId,
					chapterId,
					lessonId,
				);
				this.setLesson(lessonData);
			}
		},
		async isOwner(): Promise<boolean> {
			const auth = useAuth();
			await this.load()
			if (!auth.loggedIn) return false;
			if (this.course === null) {
				return false;
			};
			return this.course.owner.id == auth.user!.id;
		}
	},
	getters: {},
});
