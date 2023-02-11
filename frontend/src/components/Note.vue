<template>
  <div
    class="flex ml-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
  >
    <Button
      class="p-0.5 text-gray-500"
      icon="plus"
      appearance="minimal"
      @click="emit('open_new_dialog')"
      title="Click to add new note"
    />
    <Button
      class="note-drag-handle"
      :style="{ padding: '0.125rem' }"
      appearance="minimal"
      title="Drag to move"
    >
      <DragIcon />
    </Button>
  </div>
  <div
    class="flex flex-1 p-2 gap-2 max-w-lg"
    @click="show_update_dialog = true"
    title="Click to update note"
  >
    <div class="icon">
      <div class="p-1.5 bg-gray-200 rounded-md">
        <FeatherIcon
          name="type"
          stroke-width="2"
          class="h-3 w-3 text-gray-700 cursor-pointer"
        />
      </div>
    </div>
    <div class="title-description">
      <div class="title-link flex items-center gap-2">
        <div class="flex items-center text-xl leading-snug font-medium h-6">
          {{ note.title }}
        </div>
        <div v-if="note.link" class="link">
          <a :href="note.link" @click.stop target="_blank">
            <FeatherIcon
              name="external-link"
              stroke-width="2"
              class="h-4 w-4 text-blue-600 cursor-pointer"
            />
          </a>
        </div>
      </div>
      <TextEditor
        v-if="html2text(note.description)"
        editor-class="prose-sm text-base text-gray-600"
        :content="note.description"
        :editable="false"
      />
    </div>
  </div>
  <div
    class="transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100"
  >
    <Button
      class="p-0.5 mr-28 text-gray-500"
      icon="x"
      appearance="minimal"
      @click="delete_note(note.name)"
      title="Click to delete note"
    />
  </div>
  <UpdateNoteDialog :note="note" v-model:show="show_update_dialog" />
</template>

<script setup>
import { FeatherIcon, TextEditor } from 'frappe-ui'
import UpdateNoteDialog from './UpdateNoteDialog.vue'
import DragIcon from './icons/DragIcon.vue'
import { notes } from '../data/notes'
import { html2text } from '../utils'
import { ref } from 'vue'

let emit = defineEmits(['open_new_dialog'])

let props = defineProps({
  note: {
    type: Object,
  },
})

let show_update_dialog = ref(false)

function delete_note(name) {
  $dialog({
    title: 'Delete note',
    message: 'Are you sure you want to delete this note?',
    actions: [
      {
        label: 'Delete',
        appearance: 'danger',
        handler: ({ close }) => {
          return notes.delete.submit(name).then(() => {
            notes.reload()
            close()
          })
        },
      },
      {
        label: 'Cancel',
      },
    ],
  })
}
</script>
