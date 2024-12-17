
export default defineNuxtPlugin((nuxtApp) => {
	return {
		provide: {
			media: (src: string) => {
				return `http://localhost:8000${src}`
			}
		}
	}
})
