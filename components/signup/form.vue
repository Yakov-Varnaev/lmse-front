<script setup>
import { login, signup } from "~/api/auth";

const auth = useAuth();

const isValid = ref(null);

const data = reactive({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  repeatPasswrd: "",
});
const isPasswordVisible = ref(false);

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

const pwdType = computed(() => {
  console.log(isPasswordVisible.value);
  return isPasswordVisible.value ? "text" : "password";
});

const updateModelValue = (value) => {
  console.log(value);
  isValid.value = value;
};

const requiredField = (value) => {
  if (value.length === 0) {
    return "This field is required!";
  }
  return true;
};

const lettersDashDot = (value) => {
  if (!/^[A-Za-z]+$/.test(value)) {
    return "Can contain only letters.";
  }
  return true;
};

const validEmail = (value) => {
  if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true;

  return "Must be a valid e-mail.";
};

function minLen(n) {
  return (value) => {
    if (value.length >= n) return true;

    return `Must contain at least ${n} characters.`;
  };
}

function mustBeEqualTo(v) {
  return (value) => {
    if (value === data[v]) return true;
    return "Passwords must match!";
  };
}

const firstNameRules = [requiredField, lettersDashDot];
const lastNameRules = [requiredField, lettersDashDot];
const emailRules = [requiredField, validEmail];
const passwordRules = [requiredField, minLen(8)];
const repeatPasswordRules = [requiredField, mustBeEqualTo("password")];

async function onSubmit() {
  console.log(data);
  try {
    await signup(data);
    useAlert().reportInfo("Welcome!");
  } catch (e) {
    console.log(e);
    return;
  }
  const resp = await auth.login({ email: data.email, password: data.password });
}
</script>

<template>
  <v-form
    fast-fail
    validate-on="input"
    :model-value="isValid"
    @update:model-value="updateModelValue"
  >
    <v-row>
      <v-col>
        <v-text-field
          label="First Name"
          v-model.trim="data.firstName"
          :rules="firstNameRules"
        />
      </v-col>
      <v-col>
        <v-text-field
          label="Last Name"
          v-model.trim="data.lastName"
          :rules="lastNameRules"
        />
      </v-col>
    </v-row>
    <v-text-field
      label="E-mail"
      type="email"
      v-model="data.email"
      :rules="emailRules"
    />
    <v-text-field
      label="Password"
      autocomplete="on"
      counter
      :type="pwdType"
      v-model="data.password"
      :rules="passwordRules"
    >
      <template v-slot:append-inner>
        <v-fade-transition leave-absolute>
          <v-icon
            v-if="data.password && isPasswordVisible"
            icon="mdi-eye-off-outline"
            @click="togglePasswordVisibility"
          />
          <v-icon
            v-if="data.password && !isPasswordVisible"
            icon="mdi-eye-outline"
            @click="togglePasswordVisibility"
          />
        </v-fade-transition>
      </template>
    </v-text-field>
    <v-text-field
      label="Repeat Password"
      :type="pwdType"
      autocomplete="on"
      :rules="repeatPasswordRules"
      v-model.trim="data.repeatPasswrd"
    >
      <template v-slot:append-inner>
        <v-fade-transition leave-absolute>
          <v-icon
            v-if="data.password && isPasswordVisible"
            icon="mdi-eye-off-outline"
            @click="togglePasswordVisibility"
          />
          <v-icon
            v-if="data.repeatPasswrd && !isPasswordVisible"
            icon="mdi-eye-outline"
            @click="togglePasswordVisibility"
          />
        </v-fade-transition>
      </template>
    </v-text-field>
    <v-btn
      block
      :disabled="!isValid"
      :color="!isValid ? '' : 'primary'"
      variant="tonal"
      type="submit"
      text="SignUp"
      @click.prevent="onSubmit"
    />
  </v-form>
</template>
