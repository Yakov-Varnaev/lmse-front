<script setup>
import { getCourses } from "~/api/courses";

const props = defineProps({
  review: {
    type: Object,
    required: true,
  },
});
const { my } = props;

let { data } = await getCourses(my);

function redirectToCourse(courseId) {
  return () =>
    useRouter().push({ name: "courses-detail", params: { id: courseId } });
}
</script>

<template>
  <div>
    <v-list>
      <v-list-item
        v-for="course in data.results"
        class="mt-2"
        @click="redirectToCourse(course.id)()"
        :key="course.id"
      >
        <v-list-item-title>
          {{ course.name }}
        </v-list-item-title>
        <v-spacer></v-spacer>
        <template v-slot:append>
          <v-chip>{{ course.state }}</v-chip>
        </template>
      </v-list-item>
    </v-list>
  </div>
</template>
