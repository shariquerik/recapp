<template>
  <div
    class="flex ml-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
  >
    <Button
      class="p-0.5 text-gray-500"
      icon="plus"
      variant="ghosted"
      @click="(e) => store.open_new_dialog(e, note.date)"
      title="Click to add new note"
    />
    <Button
      class="note-drag-handle p-0.5"
      variant="ghosted"
      title="Drag to move"
    >
      <DragIcon />
    </Button>
  </div>
  <div
    class="flex flex-1 p-2 gap-2 max-w-xl"
    @click="store.open_edit_dialog(note)"
    title="Click to update note"
  >
    <div class="icon">
      <div class="p-1.5 bg-gray-200 rounded">
        <FeatherIcon
          name="type"
          :stroke-width="2"
          class="h-3 w-3 text-gray-700 cursor-pointer"
        />
      </div>
    </div>
    <div class="title-description">
      <div class="title-link flex items-center gap-2">
        <div class="text-lg leading-normal font-medium">
          {{ note.title }}
        </div>
        <div v-if="note.link" class="link">
          <a :href="note.link" @click.stop target="_blank">
            <FeatherIcon
              name="external-link"
              :stroke-width="2"
              class="h-4 w-4 text-gray-600 hover:text-gray-800 cursor-pointer"
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
      variant="ghosted"
      @click="delete_note(note.name)"
      title="Click to delete note"
    />
  </div>
</template>

<script setup>
import { FeatherIcon, TextEditor } from 'frappe-ui'
import DragIcon from './icons/DragIcon.vue'
import { notes } from '../data/notes'
import { html2text } from '../utils'
import { inject } from 'vue'
import { useStore } from '../store'

let store = useStore()

let props = defineProps({
  note: {
    type: Object,
  },
})

let dialog = inject('$dialog')

function delete_note(name) {
  dialog({
    title: 'Delete note',
    message: 'Are you sure you want to delete this note?',
    actions: [
      {
        label: 'Delete',
        variant: 'solid',
        theme: 'red',
        onClick: ({ close }) => {
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
