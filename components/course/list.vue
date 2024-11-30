<script setup lang="ts">
import type { Course } from "~/types";

const props = defineProps<{
  isAuthor: boolean;
  courses: Course[];
}>();

const emit = defineEmits(["delete"]);

const deleteConfirmationDialog = ref(false);

const toggleDeleteConfirmationDialog = () => {
  deleteConfirmationDialog.value = !deleteConfirmationDialog.value;
};

const performDelete = (course: Course) => {
  toggleDeleteConfirmationDialog();
  emit("delete", course);
};

const redirectToCourse = (courseId: string) => {
  return () =>
    useRouter().push({ name: "course-editor", params: { id: courseId } });
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
          <v-dialog v-model="deleteConfirmationDialog">
            <template v-slot:activator="{ props: activatorProps }">
              <v-hover v-if="isAuthor">
                <template #default="{ isHovering, props }">
                  <v-btn
                    v-bind="{ ...props, ...activatorProps }"
                    icon
                    flat
                    :class="{ 'text-red': isHovering }"
                  >
                    <v-icon icon="mdi-delete-outline" />
                  </v-btn>
                </template>
              </v-hover>
            </template>
            <v-row align="center" justify="center">
              <v-col cols="4">
                <v-card>
                  <v-card-text> Are you sure? </v-card-text>
                  <v-card-actions>
                    <ButtonBlock
                      @cancel="deleteConfirmationDialog = false"
                      @submit="() => performDelete(course)"
                    />
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-dialog>
        </template>
      </v-list-item>
    </v-list>
  </div>
</template>
