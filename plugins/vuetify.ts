// import this after install `@mdi/font` package

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { VTreeview } from 'vuetify/labs/VTreeview'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
	const vuetify = createVuetify({
		// ... your configuration
		components: {
			VTreeview,
		},
		defaults: {
			VNavigationDrawer: {
				class: "bg-background"
			},
			VList: {
				class: "bg-background"
			},
			VCard: {
				class: "bg-background"
			},
		}
	})
	app.vueApp.use(vuetify)
})
