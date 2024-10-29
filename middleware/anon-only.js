export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuth();
  const alert = useAlert();
  if (auth.loggedIn) {
    alert.reportInfo("Вы уже вошли в аккаунт!");
    return navigateTo({ name: "index" });
  }
});
