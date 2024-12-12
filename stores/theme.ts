import { ref } from "vue";
import { defineStore } from "pinia";
import { useDisplay, useTheme } from "vuetify";

export const useThemeStore = defineStore("theme/store", () => {
	const drawerMenu = ref(false);

	const toggleDrawerMenu = () => {
		drawerMenu.value = !drawerMenu.value;
	};

	const theme = ref(window.localStorage.getItem("theme") || "light");
	const vuetifyTheme = useTheme();

	vuetifyTheme.global.name.value = theme.value;

	function toggle() {
		theme.value = theme.value === "light" ? "dark" : "light";
		vuetifyTheme.global.name.value = theme.value;
		window.localStorage.setItem("theme", theme.value);
	}
	return { theme, toggle, toggleDrawerMenu, drawerMenu };
});
