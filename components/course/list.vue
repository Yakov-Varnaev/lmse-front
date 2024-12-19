<script setup lang="ts">
import type { Course } from "~/types";

defineProps<{
  isAuthor: boolean;
  courses: Course[];
}>();

const emit = defineEmits(["delete"]);

const deleteConfirmationDialog = ref(false);
const courseToDelete = ref<Course | null>(null);

const openCoursedeleteConfirmationDialog = (course: Course) => {
  courseToDelete.value = course;
  toggleDeleteConfirmationDialog();
};

const toggleDeleteConfirmationDialog = () => {
  deleteConfirmationDialog.value = !deleteConfirmationDialog.value;
};

const performDelete = () => {
  toggleDeleteConfirmationDialog();
  emit("delete", courseToDelete.value);
};

const redirectToCourse = (courseId: string) => {
  return () =>
    useRouter().push({ name: "course-editor", params: { id: courseId } });
};
</script>

<template>
  <div>
    <v-dialog v-model="deleteConfirmationDialog">
      <v-row align="center" justify="center">
        <v-col cols="4">
          <v-card>
            <v-card-title> Are you sure? </v-card-title>
            <v-card-text> Delete {{ courseToDelete!.title }} </v-card-text>
            <v-card-actions>
              <ButtonBlock
                @cancel="deleteConfirmationDialog = false"
                @submit="() => performDelete()"
              />
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-dialog>
    <!-- list -->
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
          <v-hover v-if="isAuthor">
            <template #default="{ isHovering, props }">
              <v-btn
                v-bind="{ ...props }"
                icon
                flat
                :class="{ 'text-red': isHovering }"
                @click.stop="() => openCoursedeleteConfirmationDialog(course)"
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
