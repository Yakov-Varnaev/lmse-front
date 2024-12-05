import { defineStore } from "pinia";

export interface Crumb {
	title: string,
	to: Object | null,
}

interface HasId {
	id: number,
	title: string,
}

interface OStorage {
	[key: string]: HasId
}

export const useBreadcrumbs = defineStore("bread", {
	state: (): {
		crumbs: Crumb[],
		objectMap: OStorage,
	} => ({
		crumbs: [],
		objectMap: {}
	}),
	actions: {
		push(crumb: Crumb) {
			this.crumbs = [...this.crumbs, crumb];
		},
		set(crumbs: Crumb[]) {
			this.crumbs = crumbs;
		},
		async loadFromContext() {
			const loader = useLoader()

			loader.withKeyLoader('bread', async () => {
				const ctx = useCourseContext()
				this.crumbs = [];
				await ctx.load()
				if (ctx.course === null) {
					return;
				}
				this.crumbs.push({ title: ctx.course.title, to: { name: 'course-detail', params: { id: ctx.course.id } } })
				if (!ctx.chapter) {
					return;
				}
				this.crumbs.push({ title: ctx.chapter.title, to: { name: 'chapter-detail', params: { id: ctx.course.id, chapterId: ctx.chapter.id } } })
				if (ctx.lesson === null) {
					return;
				}
				this.crumbs.push({
					title: ctx.lesson.title,
					to: { name: 'lesson-detail', params: { id: ctx.course.id, chapterId: ctx.chapter.id, lessonId: ctx.lesson.id } }
				})
			})
		}
	},
	persist: true,
});
