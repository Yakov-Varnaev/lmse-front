<script setup lang="ts">
type CheckError = {
  code: string;
};
const props = defineProps<{
  data: {
    id: string;
    title: string;
    valid: boolean;
    errors: CheckError[];
    chapters: {
      id: string;
      title: string;
      order: number;
      errors: CheckError[];
      lessons: {
        id: string;
        title: string;
        order: number;
        errors: CheckError[];
        blocks: { id: string; order: number; errors: CheckError[] }[];
      }[];
    }[];
  };
}>();
</script>

<template>
  <div>
    <v-card variant="text">
      <v-card-title>{{ data.title }}</v-card-title>
      <v-card-text>
        <ul>
          <li v-for="err in data.errors">{{ err.code }}</li>
        </ul>
      </v-card-text>

      <!-- chapters -->
      <v-card variant="text" v-for="chapter in data.chapters">
        <v-card
          variant="tonal"
          :to="{
            name: 'chapter-detail',
            params: { id: data.id, chapterId: chapter.id },
          }"
          :color="chapter.errors.length ? 'error' : 'success'"
        >
          <v-card-title>{{ chapter.title }}</v-card-title>
        </v-card>

        <v-card-text>
          <CourseCheckErrorList :errors="chapter.errors" />
        </v-card-text>
        <!-- lessons -->

        <v-row justify="end">
          <v-col cols="11">
            <v-card variant="text" v-for="lesson in chapter.lessons">
              <v-card
                variant="tonal"
                :color="lesson.errors.length ? 'error' : 'success'"
                :to="{
                  name: 'lesson-detail',
                  params: {
                    id: data.id,
                    chapterId: chapter.id,
                    lessonId: lesson.id,
                  },
                }"
              >
                <v-card-title>{{ lesson.title }}</v-card-title>
              </v-card>

              <v-card-text>
                <CourseCheckErrorList :errors="lesson.errors" />
              </v-card-text>
              <v-row justify="end">
                <v-col cols="11">
                  <v-card variant="text" v-for="block in lesson.blocks">
                    <v-card-text>
                      <v-card
                        variant="tonal"
                        :color="block.errors.length ? 'error' : 'success'"
                        :to="{
                          name: 'lesson-detail',
                          params: {
                            id: data.id,
                            chapterId: chapter.id,
                            lessonId: lesson.id,
                          },
                          query: { blockId: block.id },
                        }"
                      >
                        <v-card-title> Block #{{ block.order }}</v-card-title>
                      </v-card>

                      <CourseCheckErrorList :errors="block.errors" />
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-card>
  </div>
</template>
