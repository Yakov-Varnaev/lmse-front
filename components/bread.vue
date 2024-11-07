<script>
export default {
  setup() {
    return { bread: useBreadcrumbs() };
  },
  computed: {
    crumbs() {
      return this.bread.crumbs;
    },
    routes() {
      let route = useRoute();
      let router = useRouter();
      let fullPath = "";
      const routes = route.fullPath.substring(1).split("/");
      let processedRoutes = routes
        .map((route) => {
          if (route) {
            fullPath = `${fullPath}/${route}`;
            let resolvedRouter = router.resolve(fullPath);
            if (resolvedRouter.meta.extra) {
              resolvedRouter[resolvedRouter.meta.extra.field] = route;
            }
            return resolvedRouter;
          }
        })
        .filter(Boolean)
        .filter((router) => router.matched.length > 0);

      return processedRoutes.map((route) => {
        if (route.meta.crumb) {
          return { title: route.meta.crumb, to: route.fullPath };
        }
        let obj = useBreadcrumbs().objectMap[route[route.meta.extra.field]];
        let objTitle = null;
        if (obj) {
          objTitle = obj.title;
        }
        return {
          title: objTitle ? objTitle : route[route.meta.extra.field],
          to: route.fullPath,
        };
      });
    },
  },
};
</script>

<template>
  <v-breadcrumbs :items="routes" />
</template>
