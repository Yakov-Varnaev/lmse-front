
export default defineNuxtPlugin((nuxtApp) => {
	return {
		provide: {
			media: (src: string) => {
				return src
				// return `http://localhost:8000${src}`
			}
		}
	}
})
