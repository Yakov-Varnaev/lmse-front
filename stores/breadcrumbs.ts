import { defineStore } from "pinia";

export interface Crumb {
	title: string
	to: Object | null
}

export const useBreadcrumbs = defineStore("bread", {
	state: () => ({
		crumbs: [] as Crumb[],
		objectMap: {}
	}),
	actions: {
		addToMap(o) {
			this.objectMap[o.id] = o;
		},
		push(crumb: Crumb) {
			this.crumbs = [...this.crumbs, crumb];
		},
		set(crumbs: Crumb[]) {
			this.crumbs = crumbs;
		},
	},
});
