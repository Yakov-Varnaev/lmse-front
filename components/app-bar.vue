<script>
export default {
	data() {
		return {
			links: [
				{
					text: "Signup",
					to: "/signup"
				},
				// {
				// 	text: "Courses",
				// 	to: "/courses"
				// }
			],
		}
	},
	methods: {
		getLinks() {
			return this.links
		},
		pushToHome() {
			this.$router.push('/')
		}
	},
}
</script>

<template>
	<v-app-bar :elevation="1" class="pr-2">
		<!-- <template v-slot:prepend> -->
		<!-- 	<v-app-bar-nav-icon></v-app-bar-nav-icon> -->
		<!-- </template> -->

		<v-app-bar-title class="brand-title" @click="pushToHome">
			LMSE
		</v-app-bar-title>

		<v-btn :to="link.to" plain nuxt v-for="link in links">
			{{ link.text }}
		</v-btn>

	</v-app-bar>
</template>

<style scoped>
.brand-title {
	cursor: pointer;
}
</style>
