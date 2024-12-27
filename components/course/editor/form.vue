<script setup lang="ts">
import { patchCourse, updateCourse } from "~/api/courses";
import type { Course } from "~/types";

const { course } = defineProps<{ course: Course }>();
const emit = defineEmits(["updated", "cancel"]);
const alert = useAlert();

const courseCopy = deepCopy(course);
delete courseCopy.image;
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

const file = ref<File | null>(null);
const fileUrl = ref("");

const updateFile = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (!target.files) return;
  const newFile = target.files[0];
  file.value = newFile;

  fileUrl.value = URL.createObjectURL(newFile);
};

const performCourseUpdate = async () => {
  if (file.value !== null) {
    console.log("file update");
    const fd = new FormData();
    fd.append("image", file.value!);
    await patchCourse(course.id, fd);
  }

  const { data } = await updateCourse(course.id, courseData);
  console.log(data);
  alert.reportInfo("Updated!");
  emit("updated", data);
};
</script>

<template>
  <CourseEditorLayout>
    <template #top-left>
      <div class="fill-height">
        <v-hover>
          <template #default="{ isHovering, props }">
            <div v-bind="props" class="d-flex flex-column fill-height">
              <v-overlay
                contained
                :model-value="!!isHovering"
                class="align-center justify-center"
              >
                <label for="avatar-input" class="ma-auto">
                  <v-btn
                    @click="$refs.imgInput.click()"
                    icon
                    size="150"
                    variant="tonal"
                    color="white"
                    class=""
                  >
                    <v-icon icon="mdi-camera" size="100" />
                  </v-btn>
                </label>
                <input
                  ref="imgInput"
                  type="file"
                  @change="updateFile"
                  id="avatar-input"
                  accept="image/*"
                />
              </v-overlay>
              <div class="fill-height overflow-hidden">
                <v-img
                  :src="fileUrl ? fileUrl : course?.image"
                  v-if="course?.image || fileUrl"
                  cover
                  height="100%"
                />
                <v-icon
                  size="200"
                  v-else
                  icon="mdi-image-outline"
                  class="ma-auto"
                  color="primary"
                />
              </div>
            </div>
          </template>
        </v-hover>
      </div>
    </template>
    <template #top-right>
      <v-text-field label="Title" v-model="course.title"></v-text-field>
      <v-row>
        <v-col>
          <CategorySelector
            variant="filled"
            hide-details
            v-model="courseData.category"
          />
        </v-col>
        <v-col>
          <LevelSelector v-model="courseData.level" label="Level" />
        </v-col>
      </v-row>
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
        @cancel="emit('cancel')"
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

#avatar-input {
  position: absolute;
  visibility: hidden;
  width: 200;
  height: 200;
}
</style>
