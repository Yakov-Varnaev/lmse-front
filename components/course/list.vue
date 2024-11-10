<script>
export default {
  props: {
    courses: {
      type: Array[Object],
      required: true,
    },
  },
  methods: {
    redirectToCourse(courseId) {
      return () =>
        useRouter().push({ name: "courses-detail", params: { id: courseId } });
    },
  },
};
</script>

<template>
  <div>
    <v-list>
      <v-list-item
        v-for="course in courses"
        class="mt-2"
        rounded
        @click="redirectToCourse(course.id)()"
        :key="course.id"
      >
        <template #prepend>
          <v-icon>mdi-circle-small</v-icon>

          <v-chip>{{ course.state }}</v-chip>
        </template>
        <v-list-item-title class="text-capitalize text-h6 text-center">
          {{ course.title }}
        </v-list-item-title>
        <v-spacer></v-spacer>
        <template v-slot:append>
          <v-hover>
            <template #default="{ isHovering, props }">
              <v-btn
                v-bind="props"
                icon
                flat
                @click.stop="$emit('delete', course)"
                :class="{ 'text-red': isHovering }"
              >
                <v-icon icon="mdi-delete-outline" />
              </v-btn>
            </template>
          </v-hover>
        </template>
      </v-list-item>
    </v-list>
  </div>
</template>
