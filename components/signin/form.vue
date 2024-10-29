<script setup>
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";

const formData = reactive({
  email: "",
  password: "",
});

const errors = reactive({
  email: [],
  password: [],
  detail: [],
});

const rules = computed(() => {
  return {
    email: { required, email },
    password: { required },
  };
});

const v$ = useVuelidate(rules, formData);
const auth = useAuth();

async function performLogin() {
  const res = await auth.login(formData);
  if (res.errors) {
    Object.assign(errors, res.errors);
    return;
  }
}

const isFormValid = computed(() => {
  return Object.keys(formData).every((key) => formData[key]) && !v$.$errors;
});

// function collectErrors(field) {
//   const vuiledateErrors = [];
//   if (v$[field]) {
//     vuelidateErrors.push(...this.v$[field].$errors.map((e) => e.$message));
//   }
//   return [...vuelidateErrors, ...this.errors[field]];
// }
</script>

<template>
  <v-form>
    <v-text-field
      type="email"
      label="E-mail"
      v-model="formData.email"
      @input="v$.email.$touch"
      @blur="v$.email.$touch"
      :error-messages="v$.email.$errors.map((e) => e.$message)"
      class="mb-2"
    />
    <v-text-field
      type="password"
      label="Password"
      v-model="formData.password"
      @input="v$.password.$touch"
      @blur="v$.password.$touch"
      :error-messages="v$.password.$errors.map((e) => e.$message)"
      class="mb-2"
    />
    <v-btn
      block
      type="submit"
      text="SignIn"
      @click.prevent="performLogin"
      :disabled="!isFormValid"
    />
  </v-form>
</template>
