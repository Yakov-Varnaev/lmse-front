<script setup lang="ts">
import type {
  Block,
  CorrectOrderDialogBlockMeta,
  CorrectOrderDialogOption,
} from "~/types";

const emit = defineEmits(["update", "cancel"]);
const props = defineProps<{
  block: Block<CorrectOrderDialogBlockMeta>;
  readonly: boolean;
}>();
const drag = ref(false);
const data = reactive<Block<CorrectOrderDialogBlockMeta>>(
  JSON.parse(JSON.stringify(props.block)),
);
const editMessages = reactive<{
  [key: string]: CorrectOrderDialogOption;
}>({});

const toggleEditMessage = (id: string) => {
  const msgIdx = data.meta.options.findIndex((opt) => opt.id === id);
  const msg = data.meta.options[msgIdx];

  if (msg.id in editMessages) {
    delete editMessages[msg.id];
  } else {
    editMessages[msg.id] = JSON.parse(JSON.stringify(msg));
  }
};

const saveMessage = (id: string) => {
  const msgIdx = data.meta.options.findIndex((opt) => opt.id === id);
  data.meta.options[msgIdx] = editMessages[id];
  toggleEditMessage(id);
};

const submit = () => {
  emit("update", data.meta);
};

const addMessage = () => {
  data.meta.options.push({
    text: "",
    sender: "Unknown Sender",
    id: crypto.randomUUID(),
    right: false,
  });
};

const removeMessage = (id: string) => {
  data.meta.options = data.meta.options.filter((opt) => opt.id !== id);
};
</script>

<template>
  <v-card>
    <VuetifyTiptap
      v-model.trim="data.meta.text"
      class="editor bg-background"
      markdown-theme="github"
      :disabled="readonly"
    />
    <v-divider class="mt-4"></v-divider>

    <v-sheet class="pa-4">
      <draggable
        item-key="id"
        v-model="data.meta.options"
        class="fill-height"
        @start="drag = true"
        @end="drag = false"
        animation="200"
        :group="`block-correct-order-dialog-${block.id}`"
      >
        <template v-slot:item="{ element: opt }">
          <v-card
            variant="tonal"
            :color="opt.right ? 'primary' : 'secondary'"
            width="50%"
            :class="{
              'ml-auto': editMessages[opt.id]
                ? editMessages[opt.id].right
                : opt.right,
              'my-1': true,
            }"
          >
            <div v-if="editMessages[opt.id]">
              <v-card-text>
                <v-text-field
                  v-model.trim="editMessages[opt.id].sender"
                  label="Sender Name"
                />
                <v-textarea
                  v-model.trim="editMessages[opt.id].text"
                  label="Message Text"
                />
                <v-select
                  v-model="editMessages[opt.id].right"
                  :items="[
                    { value: false, title: 'Left' },
                    { value: true, title: 'Right' },
                  ]"
                />
              </v-card-text>
              <v-card-actions>
                <v-btn
                  @click="() => saveMessage(opt.id)"
                  size="small"
                  text="Save"
                />
                <v-btn @click="() => toggleEditMessage(opt.id)" text="Cancel" />
              </v-card-actions>
            </div>
            <div v-else>
              <v-card-text>
                <span>{{ opt.sender || "Empty Sender" }}</span>
                <p>
                  {{ opt.text || "Empty Text" }}
                </p>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  @click="() => removeMessage(opt.id)"
                  size="small"
                  text="Remove"
                />
                <v-btn @click="() => toggleEditMessage(opt.id)" text="Edit" />
              </v-card-actions>
            </div>
          </v-card>
        </template>
      </draggable>
      <v-card variant="tonal" color="info" class="my-4">
        <v-card-text class="pa-2 text-center">
          <v-icon icon="mdi-alert-outline" />
          Drag the message to change order!
        </v-card-text>
      </v-card>
      <v-btn block @click="addMessage" color="primary">Add Message</v-btn>
    </v-sheet>

    <v-card-actions>
      <ButtonBlock @cancel="$emit('cancel')" @submit="submit" />
    </v-card-actions>
  </v-card>
</template>
