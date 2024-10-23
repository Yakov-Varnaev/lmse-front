// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
	build: {
		transpile: ['vuetify'],
	},
	compatibilityDate: '2024-04-03',
	devtools: { enabled: true },
	devServer: {
		port: 3000,
	},
	modules: [
		(_options, nuxt) => {
			nuxt.hooks.hook('vite:extendConfig', (config) => {
				// @ts-expect-error
				config.plugins.push(vuetify({ autoImport: true }))
			})
		},
		'@sidebase/nuxt-auth',
	],
	auth: {
		isEnabled: false,
		baseURL: `http://localhost:${process.env.PORT || 3000}`
	},
	vite: {
		vue: {
			template: {
				transformAssetUrls,
			},
		},
	},
})
