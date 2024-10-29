<script>
export default {
  props: {
    userId: {
      type: String,
      required: true,
    },
  },
  setup() {
    return {
      users: useUsers(),
    };
  },
  data() {
    return {
      user: {},
    };
  },
  mounted() {
    this.fetchUser();
  },
  methods: {
    async fetchUser() {
      const user = await this.users.retrieveUser(this.userId);
      this.user = user;
    },
    fullName() {
      return `${this.user?.firstName} ${this.user?.lastName}`;
    },
  },
};
</script>

<template>
  <v-container>
    <v-row no-gutters align="center">
      <v-col md="3" offset-md="2" class="d-flex">
        <v-avatar size="auto" class="">
          <v-icon size="200">mdi-account</v-icon>
          <v-img :src="user?.avatar" v-if="user?.avatar" />
        </v-avatar>
      </v-col>
      <v-col md="5">
        <v-card variant="tonal" :title="fullName()" :subtitle="user.email">
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
