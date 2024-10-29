<script>
export default {
  setup() {
    definePageMeta({
      name: "signout",
      layout: "centered",
      middleware: "authenticated",
    });
    return {};
  },
  methods: {
    logout() {
      useAuth().reset();
      this.$router.push("/");
    },
    goBack() {
      this.$router.back();
    },
  },
};
</script>

<template>
  <v-col md="3">
    <v-card>
      <v-card-title> Are your sure? </v-card-title>
      <v-card-actions>
        <v-row>
          <v-col>
            <v-btn @click="logout" color="red" block>Yes</v-btn>
          </v-col>
          <v-col>
            <v-btn @click="goBack" color="success" block>No</v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-col>
</template>
