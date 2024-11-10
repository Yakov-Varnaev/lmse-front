// import { markRaw } from 'vue'
import { VuetifyTiptap, VuetifyViewer, createVuetifyProTipTap } from 'vuetify-pro-tiptap'
import { BaseKit, Bold, Italic, Underline, Strike, Color, Highlight, Heading, TextAlign, FontFamily, FontSize, SubAndSuperScript, BulletList, OrderedList, TaskList, Indent, Link, Image, Video, Table, Blockquote, HorizontalRule, Code, CodeBlock, Clear, Fullscreen, History } from 'vuetify-pro-tiptap'
import 'vuetify-pro-tiptap/styles/editor.css' // only use editor style, not using markdown style
import './styles/markdown/github.scss'

export default defineNuxtPlugin((app) => {
	const vuetifyProTipTap = createVuetifyProTipTap({
		lang: 'en',
		markdownTheme: 'github',
		components: {
			VuetifyTiptap,
			VuetifyViewer
		},
		extensions: [
			BaseKit.configure({
				placeholder: {
					placeholder: 'Enter some text...'
				}
			}),
			Bold,
			Italic,
			Underline,
			Strike,
			Code.configure({ divider: true }),
			Heading,
			TextAlign,
			FontFamily,
			FontSize,
			Color,
			Highlight.configure({ divider: true }),
			SubAndSuperScript.configure({ divider: true }),
			Clear.configure({ divider: true }),
			BulletList,
			OrderedList,
			TaskList,
			Indent.configure({ divider: true }),
			Link,
			// Image.configure({
			// 	imageTabs: [{ name: 'SELECT', component: markRaw(SelectImage) }],
			// 	// hiddenTabs: ['upload'],
			// 	upload(file: File) {
			// 		const url = URL.createObjectURL(file)
			// 		console.log('mock upload api :>> ', url)
			// 		return Promise.resolve(url)
			// 	}
			// }),
			// Video,
			Table.configure({ divider: true }),
			Blockquote,
			HorizontalRule,
			CodeBlock.configure({ divider: false }),
			History,
		]
	})
	app.vueApp.use(vuetifyProTipTap)
})
