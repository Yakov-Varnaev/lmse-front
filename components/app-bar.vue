<script>
export default {
  setup() {
    let authStore = useAuth();
    let themeStore = useThemeStore();
    return { authStore, themeStore };
  },
  data() {
    return {
      rawPaths: [
        {
          title: "Signup",
          link: { name: "signup" },
          logged: false,
        },
        {
          title: "Signin",
          link: { name: "signin" },
          logged: false,
        },
        {
          title: "SignOut",
          link: { name: "signout" },
          logged: true,
          color: "red",
        },
      ],
    };
  },
  methods: {
    toggleTheme() {
      this.themeStore.toggle();
    },
    getLinks() {
      return this.links;
    },
    pushToHome() {
      this.$router.push("/");
    },
    pushToProfile() {
      this.$router.push({
        name: "profile",
        params: { id: this.authStore.user.id },
      });
    },
    paths() {
      return this.rawPaths.filter((p) => this.authStore.loggedIn === p.logged);
    },
  },
  computed: {
    isAuth() {
      return this.authStore.loggedIn;
    },
  },
};
</script>

<template>
  <v-app-bar :elevation="0" class="pr-2 bg-background">
    <div class="mr-auto ml-5 pa-2 d-flex">
      <div class="brand-title my-auto link" @click="pushToHome">LMSE</div>

      <v-divider vertical class="mx-2" v-if="isAuth" />

      <div v-if="isAuth" class="link" @click="pushToProfile" elevation="0">
        <span class="ma-0 pa-0">{{ authStore.getFullName }}</span>
        <div class="ma-0 pa-0 text-caption">{{ authStore.user?.email }}</div>
      </div>
    </div>

    <v-spacer></v-spacer>

    <Bread />

    <v-spacer></v-spacer>

    <v-btn
      :to="path.link"
      plain
      nuxt
      v-for="path in paths()"
      :color="path.color"
      class="mx-1"
    >
      {{ path.title }}
    </v-btn>
    <v-btn
      icon
      elevation="1"
      @click.prevent="toggleTheme"
      class="mx-1"
      size="small"
    >
      <v-icon>mdi-theme-light-dark</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<style scoped>
.link {
  cursor: pointer;
}
</style>
