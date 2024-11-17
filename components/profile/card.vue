<script>
import { retrieveUser, updateMe } from "~/api/users";

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
      isAvatarEdit: false,
      file: null,
      fileUrl: null,
      imageChanged: false,
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
      const { data } = await retrieveUser(this.userId);
      const user = data;
      this.profileData.firstName = user.firstName;
      this.profileData.lastName = user.lastName;
      this.user = user;
    },
    fullName() {
      return `${this.user?.firstName || "Unknown"} ${this.user?.lastName || "Unknown"}`;
    },
    toggleAvatarEdit() {
      this.isAvatarEdit = !this.isAvatarEdit;
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
      this.loader.startLoading();

      var { data } = await updateMe(this.profileData);
      this.user.firstName = data.firstName;
      this.user.lastName = data.lastName;

      if (this.file) {
        const fd = new FormData();
        fd.append("avatar", this.file);
        await updateMe(fd);
      }

      await this.auth.getMe();
      this.user = { ...this.auth.user };
      this.loader.stopLoading();
    },
    profileEditCancel() {
      this.file = null;
      this.fileUrl = null;
      this.imageChanged = false;
      this.closeProfileEdit();
    },
    async updateFile(e) {
      const file = e.target.files[0];
      this.file = file;
      this.fileUrl = URL.createObjectURL(file);
      this.imageChanged = true;
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
  <v-row align="center" class="" no-gutters>
    <v-col md="4" xl="3" class="ml-2 d-flex">
      <v-hover>
        <template #default="{ isHovering, props }">
          <v-avatar v-bind="props" size="200" class="mx-auto">
            <v-overlay
              v-model="isProfileEdit"
              contained
              v-if="isHovering && isProfileEdit"
              class="align-center justify-center"
            >
              <v-btn icon size="150" variant="tonal" color="white">
                <label for="avatar-input">
                  <v-icon icon="mdi-camera" size="100" />
                </label>
              </v-btn>
              <input
                type="file"
                @change="updateFile"
                id="avatar-input"
                accept="image/*"
              />
            </v-overlay>
            <v-img
              :src="fileUrl ? fileUrl : user?.avatar"
              v-if="user?.avatar"
            />
            <v-icon size="200" v-else>mdi-account</v-icon>
          </v-avatar>
        </template>
      </v-hover>
    </v-col>

    <v-col class="ml-2">
      <!-- edit card start -->
      <v-card variant="text" v-if="isProfileEdit" color="red">
        <v-card-text>
          <v-form>
            <v-row>
              <v-col>
                <v-text-field
                  class="ma-0"
                  label="First Name"
                  density="compact"
                  v-model.trim="profileData.firstName"
                />
              </v-col>
              <v-col>
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
                :disabled="!isProfileEditSubmitActive && !imageChanged"
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
        color="red"
      >
        <v-card-actions v-if="isSelf">
          <v-btn block @click="openProfileEdit">Edit</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<style lang="scss">
#avatar-input {
  position: absolute;
  visibility: hidden;
  width: 200;
  height: 200;
}
</style>
