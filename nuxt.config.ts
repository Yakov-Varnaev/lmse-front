// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
	build: {
		transpile: ['vuetify'],
	},
	ssr: false,
	compatibilityDate: '2024-04-03',
	devtools: { enabled: true },
	devServer: {
		port: 3000,
	},
	modules: [
		'@nuxt/devtools',
		(_options, nuxt) => {
			nuxt.hooks.hook('vite:extendConfig', (config) => {
				// @ts-expect-error
				config.plugins.push(vuetify({ autoImport: true }))
			})
		},
		'@pinia/nuxt',
		'@pinia-plugin-persistedstate/nuxt',
	],
	pinia: {
		storesDirs: ['./stores/**']
	},
	vite: {
		vue: {
			template: {
				transformAssetUrls,
			},
		},
	},
	runtimeConfig: {

		public: {
			baseURL: process.env.BASE_URL || 'http://127.0.0.1:8000',
		},
	},
})
