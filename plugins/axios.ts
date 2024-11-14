import { createAxios } from "~/axios"

export default defineNuxtPlugin((nuxtApp) => {
	const cfg = useRuntimeConfig()
	const apiv1 = createAxios({
		baseURL: cfg.public.baseURL + "/api/v1",
	})

	return {
		provide: {
			apiv1
		}
	}
})
