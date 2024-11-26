import { defineStore } from "pinia";

type OnlyBools = {
	[key: string]: boolean;
};

export const useLoader = defineStore("loader", {
	state: () => ({
		loading: false,
		loaderMap: {} as OnlyBools,
	}),
	actions: {
		startKeyLoading(key: string) {
			this.loaderMap[key] = true;
		},
		stopKeyLoading(key: string) {
			this.loaderMap[key] = false;
		},
		async withLoader(func: CallableFunction, ...args: any[]) {
			this.startLoading();
			let res = await func(...args);
			this.stopLoading();
			return res;
		},
		startLoading() {
			this.loading = true;
		},
		stopLoading() {
			this.loading = false;
		},
	},
});
