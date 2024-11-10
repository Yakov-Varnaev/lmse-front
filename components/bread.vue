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
  <!-- class="rounded-b-lg mt-n3 pt-6" -->
</template>

<style scoped lang="scss">
#notch {
  box-shadow: 24px 0;
}

#notch-left,
#notch-right {
  width: 100px;
  height: 100px;
  overflow: hidden;
  position: relative;
}

#notch-left:before,
#notch-right:before {
  content: "";
  display: block;
  width: 80%;
  height: 80%;
  position: absolute;
  border-radius: 60%;
}

#notch-left:before {
  top: 0;
  right: 0;
  box-shadow: 70px -40px 0 0 red;
}

#notch-right:before {
  top: 0;
  left: 0;
  box-shadow: -50px -50px 0 0;
}
</style>
