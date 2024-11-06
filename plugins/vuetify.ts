// import this after install `@mdi/font` package

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
	const vuetify = createVuetify({
		// ... your configuration
		defaults: {
			VNavigationDrawer: {
				class: "bg-background"
			},
			VList: {
				class: "bg-background"
			}
		}
	})
	app.vueApp.use(vuetify)
})
