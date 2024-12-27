<script setup lang="ts">
import { useDisplay } from "vuetify";

const theme = useThemeStore();
const display = useDisplay();

const emit = defineEmits(["updated", "openCreate", "delete"]);
const props = defineProps<{
  title: string;
  editMode: boolean;
  showActionButton: boolean;
  items: Object[];
  onDelete: (item: any) => Promise<void>;
}>();

const deleteConfirmationDialog = ref(false);

const toggleDeleteDialog = () => {
  deleteConfirmationDialog.value = !deleteConfirmationDialog.value;
};

const itemUpdate = (data: any) => {
  emit("updated", data);
};

const itemToDelete = ref<any | null>(null);

const performDelete = (item: any) => {
  itemToDelete.value = item;
  toggleDeleteDialog();
};

const performItemDelete = async () => {
  await props.onDelete(itemToDelete.value);
  toggleDeleteDialog();
};

onBeforeUnmount(() => {
  if (display.lgAndDown.value && theme.drawerMenu) {
    theme.toggleDrawerMenu();
  }
});
</script>

<template>
  <div>
    <v-navigation-drawer
      :border="0"
      :model-value="theme.drawerMenu || $vuetify.display.lgAndUp"
      class="rounded-te-xl"
    >
      <v-dialog id="deleteDialog" v-model="deleteConfirmationDialog">
        <v-row justify="center">
          <v-col cols="4">
            <v-card>
              <v-card-text> Are you sure? </v-card-text>
              <v-card-actions>
                <ButtonBlock
                  @cancel="toggleDeleteDialog"
                  @submit="() => performItemDelete()"
                />
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-dialog>

      <v-list-item class="pa-3 bg-primary border rounded-e-xl">
        <div class="d-flex align-center">
          <h1>{{ $props.title }}</h1>
          <slot name="actionButton" v-if="showActionButton">
            <v-btn
              icon
              variant="tonal"
              class="ml-auto"
              elevation="0"
              @click="emit('openCreate')"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </slot>
        </div>
      </v-list-item>

      <draggable
        :list="items"
        item-key="id"
        @update="itemUpdate"
        handle=".handle"
      >
        <template v-slot:item="{ element }">
          <v-list-item :to="editMode ? null : element.to">
            <template #prepend>
              <v-btn
                size="xs"
                icon
                elevation="0"
                class="mr-2 pa-1"
                color="background"
              >
                <v-icon
                  size="xs"
                  icon="mdi-menu"
                  color="primary"
                  class="handle"
                />
              </v-btn>
            </template>
            <v-list-item-title>
              {{ element.title }}
            </v-list-item-title>
            <template #append>
              <v-hover v-if="editMode">
                <template #default="{ isHovering, props }">
                  <v-btn
                    elevation="0"
                    v-bind="props"
                    icon
                    color="background"
                    size="xs"
                    class="pa-1"
                    @click="performDelete(element)"
                  >
                    <v-icon
                      size="xs"
                      icon="mdi-delete-outline"
                      :class="{
                        'text-red': isHovering,
                        'text-grey': !isHovering,
                      }"
                    />
                  </v-btn>
                </template>
              </v-hover>
              <v-icon v-else icon="mdi-circle-outline" size="xs" color="grey" />
            </template>
          </v-list-item>
        </template>
      </draggable>
      <template #append>
        <v-list-item>
          <EditToggler block />
        </v-list-item>
        <slot name="append"></slot>
      </template>
    </v-navigation-drawer>
  </div>
</template>
