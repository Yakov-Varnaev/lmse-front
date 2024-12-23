<script setup lang="ts">
import { updateCourse } from "~/api/courses";
import type { Course } from "~/types";

const { course } = defineProps<{ course: Course }>();
const emit = defineEmits(["updated"]);
const courseCopy = deepCopy(course);
courseCopy.category = course.category?.id ?? null;
const courseData = reactive<Course>(courseCopy);

const courseTagsInput = ref("");

const removeTag = (idx: number) => {
  courseData.tags.splice(idx, 1);
};

const addTag = () => {
  courseData.tags.push(courseTagsInput.value);
  courseTagsInput.value = "";
};

watch(courseTagsInput, (newTag: string) => {
  if (newTag.endsWith(",") || newTag.endsWith(" ")) {
    const cleanedTag = newTag.substring(0, newTag.length - 1);
    if (cleanedTag.length) {
      courseData.tags.push(cleanedTag);
    }
    courseTagsInput.value = "";
  }
});

const performCourseUpdate = async () => {
  const { data } = await updateCourse(course.id, courseData);
  emit("updated", data);
};
</script>

<template>
  <CourseEditorLayout>
    <template #top-right>
      <v-text-field label="Title" v-model="course.title"></v-text-field>
      <CategorySelector
        variant="filled"
        hide-details
        v-model="courseData.category"
      />
      <div class="my-3">
        <v-chip disabled v-if="!courseData.tags.length">No tags</v-chip>

        <v-chip
          color="primary"
          v-for="(tag, idx) in courseData.tags"
          class="ma-1 tag-chip"
          :ripple="false"
        >
          {{ tag }}
          <template #append>
            <v-icon
              icon="mdi-close"
              class="ml-2 tag-chip-icon"
              @click="() => removeTag(idx)"
            />
          </template>
        </v-chip>
      </div>
      <v-text-field
        :disabled="courseData.tags.length > 9"
        @keyup.enter="addTag"
        label="Tags"
        hint="Keywords to describe your course"
        v-model="courseTagsInput"
        rows="3"
        :counter-value="() => courseData.tags.length"
      >
      </v-text-field>
    </template>
    <template #bottom>
      <v-textarea
        rows="5"
        max-rows="5"
        counter
        v-model.trim="course.shortDescription"
        label="Short Description"
      ></v-textarea>
      <VuetifyTiptap v-model="courseData.description" class="mt-4" />
      <ButtonBlock
        :submit-porps="{ text: 'Save' }"
        @submit="performCourseUpdate"
        class="mt-2"
      />
    </template>
  </CourseEditorLayout>
</template>

<style lang="scss" scoped>
.course-card-top {
  aspect-ratio: 1 / 1;
}

.tag-chip {
  pointer-events: none;
}

.tag-chip-icon {
  pointer-events: all;
}
</style>
