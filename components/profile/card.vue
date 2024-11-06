<script>
import { updateMe } from "~/api/users";

export default {
  props: {
    userId: {
      type: String,
      required: true,
    },
  },
  setup() {
    return {
      loader: useLoader(),
      users: useUsers(),
      auth: useAuth(),
    };
  },
  data() {
    return {
      user: {},
      isProfileEdit: false,
      profileData: {
        firstName: "",
        lastName: "",
      },
      isSelf: this.auth.user.id === this.userId,
    };
  },
  mounted() {
    this.fetchUser();
  },
  methods: {
    async fetchUser() {
      const user = await this.users.retrieveUser(this.userId);
      this.profileData.firstName = user.firstName;
      this.profileData.lastName = user.lastName;
      this.user = user;
    },
    fullName() {
      return `${this.user?.firstName || "Unknown"} ${this.user?.lastName || "Unknown"}`;
    },
    // edit profile
    openProfileEdit() {
      this.isProfileEdit = true;
    },
    closeProfileEdit() {
      this.isProfileEdit = false;
    },
    async profileEditSubmit() {
      this.closeProfileEdit();
      let { data } = await this.loader.withLoader(updateMe, this.profileData);
      this.user.firstName = data.firstName;
      this.user.lastName = data.lastName;
      await this.auth.getMe();
    },
    profileEditCancel() {
      this.closeProfileEdit();
    },
  },
  computed: {
    isProfileEditSubmitActive() {
      return (
        this.user.firstName !== this.profileData.firstName ||
        this.user.lastName !== this.profileData.lastName
      );
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
        <!-- edit card start -->
        <v-card variant="text" v-if="isProfileEdit">
          <v-card-text>
            <v-form>
              <v-row>
                <v-col class="">
                  <v-text-field
                    class="ma-0"
                    label="First Name"
                    pattern="[a-zA-Z]"
                    density="compact"
                    v-model.trim="profileData.firstName"
                  />
                </v-col>
                <v-col class="">
                  <v-text-field
                    class="ma-0"
                    label="Last Name"
                    density="compact"
                    v-model.trim="profileData.lastName"
                  />
                </v-col>
              </v-row>
            </v-form>
            <span class="text-subtitle-2 text-grey">{{ user.email }}</span>
          </v-card-text>

          <v-card-actions>
            <v-row>
              <v-col>
                <v-btn
                  block
                  color="success"
                  :disabled="!isProfileEditSubmitActive"
                  @click="profileEditSubmit"
                >
                  <v-icon>mdi-check</v-icon>
                </v-btn>
              </v-col>
              <v-col>
                <v-btn block color="red" @click="profileEditCancel">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
        <!-- edict card end-->
        <v-card
          variant="text"
          v-else
          :title="fullName()"
          :subtitle="user.email"
        >
          <v-card-actions v-if="isSelf">
            <v-btn block @click="openProfileEdit">Edit</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
