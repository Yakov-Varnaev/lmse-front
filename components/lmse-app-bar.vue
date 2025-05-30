<script setup lang="ts">
import { useDisplay } from "vuetify";

const authStore = useAuth();
const themeStore = useThemeStore();
const { mdAndUp, smAndDown, ...display } = useDisplay();

const mobileMenu = ref(false);

const rawPaths = [
  { title: "Signup", link: { name: "signup" }, logged: false },
  { title: "Signin", link: { name: "signin" }, logged: false },
  { title: "Courses", link: { name: "courses" }, logged: true },
  { title: "SignOut", link: { name: "signout" }, logged: true, color: "red" },
];

const isAuth = computed(() => authStore.loggedIn);
const filteredPaths = computed(() =>
  rawPaths.filter((p) => authStore.loggedIn === p.logged),
);

const pushToHome = () => {
  useRouter().push("/");
};

const pushToProfile = () => {
  if (!authStore.user) {
    return;
  }
  useRouter().push({
    name: "profile",
    params: { id: authStore.user.id },
  });
};

const toggleTheme = () => themeStore.toggle();
</script>

<template>
  <v-app-bar flat class="bg-background px-2">
    <!-- Mobile: hamburger menu -->
    <v-app-bar-nav-icon @click="mobileMenu = !mobileMenu" v-if="smAndDown" />
    <v-menu v-model="mobileMenu" location="bottom start">
      <v-list>
        <v-list-item @click="pushToHome">
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>
        <v-list-item
          v-for="path in filteredPaths"
          :key="path.title"
          :to="path.link"
          nuxt
        >
          <v-list-item-title :class="path.color ? 'text-' + path.color : ''">
            {{ path.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <!-- Desktop: home button -->
    <v-btn
      icon
      @click="pushToHome"
      class="ml-2"
      v-if="mdAndUp && $route.name !== 'index'"
    >
      <v-icon>mdi-home</v-icon>
    </v-btn>

    <!-- Title -->
    <v-toolbar-title class="ml-2 text-truncate">
      LMSE <small>[{{ display.name.value }}]</small>
    </v-toolbar-title>

    <v-spacer />

    <!-- Profile -->
    <div
      class="d-flex align-center link-pointer"
      @click="pushToProfile"
      v-if="isAuth && authStore.user"
    >
      <v-avatar size="32" color="primary" class="mr-2">
        <v-img v-if="authStore.user.avatar" :src="authStore.user.avatar" />
        <span v-else>
          {{ authStore.user.firstName[0] }}{{ authStore.user.lastName[0] }}
        </span>
      </v-avatar>
      <div class="d-none d-sm-flex flex-column">
        <span>{{ authStore.getFullName }}</span>
        <small class="text-primary">{{ authStore.user.email }}</small>
      </div>
    </div>
    <v-spacer v-if="mdAndUp" />

    <!-- Breadcrumbs only on desktop -->
    <Bread v-if="mdAndUp" />

    <!-- Desktop: nav buttons -->
    <v-btn
      v-if="mdAndUp"
      v-for="path in filteredPaths"
      :key="path.title"
      :to="path.link"
      plain
      nuxt
      :color="path.color"
      class="mx-1"
    >
      {{ path.title }}
    </v-btn>

    <!-- Theme toggle (always visible) -->
    <v-btn icon @click.prevent="toggleTheme" class="mx-1" size="small">
      <v-icon>mdi-theme-light-dark</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<style scoped>
.link-pointer {
  cursor: pointer;
}
</style>
