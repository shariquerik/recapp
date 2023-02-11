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
      @click="show_confirm_dialog = true"
      title="Click to delete note"
    />
  </div>
  <Dialog
    :options="{
      actions: [
        {
          label: 'Update',
          appearance: 'primary',
          handler: () => update_note(note),
        },
        { label: 'Cancel' },
      ],
      size: '2xl',
    }"
    v-model="show_update_dialog"
  >
    <template #body-title>
      <h2 class="text-2xl font-semibold mb-4">Update Note</h2>
    </template>
    <template #body-content>
      <div class="flex flex-col gap-4">
        <Input label="Title" placeholder="Note Title" v-model="note.title" />
        <Input
          iconLeft="link"
          label="Link"
          placeholder="Note Link"
          v-model="note.link"
        />
        <span class="-mb-2 block text-sm leading-4 text-gray-700"
          >Description</span
        >
        <TextEditor
          editor-class="prose-sm border max-w-none rounded-b-lg p-2 overflow-auto h-40 focus:outline-none"
          :fixedMenu="true"
          :content="note.description"
          @change="(val) => (note.description = val)"
        />
      </div>
    </template>
  </Dialog>
  <Dialog
    :options="{
      title: 'Delete Note',
      message: 'Are you sure want to delete this note?',
      icon: {
        name: 'trash-2',
        appearance: 'danger',
      },
      size: 'sm',
      actions: [
        {
          label: 'Delete',
          appearance: 'primary',
          handler: () => delete_note(note.name),
        },
        { label: 'Cancel' },
      ],
    }"
    v-model="show_confirm_dialog"
  />
</template>

<script setup>
import { FeatherIcon, Dialog, Input, TextEditor } from 'frappe-ui'
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
let show_confirm_dialog = ref(false)

function update_note(note) {
  notes.setValue.submit(
    {
      name: note.name,
      title: note.title,
      description: note.description,
      link: note.link,
    },
    {
      onSuccess: () => {
        notes.reload()
        show_update_dialog.value = false
      },
    }
  )
}

function delete_note(name) {
  notes.delete.submit(name, {
    onSuccess: () => {
      notes.reload()
      show_confirm_dialog.value = false
    },
  })
}
</script>
