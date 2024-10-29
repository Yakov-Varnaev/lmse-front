export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuth();
  const alert = useAlert();
  if (!auth.loggedIn) {
    alert.reportInfo("Войдите в аккаунт");
    return navigateTo({ name: "signin" });
  }
});
