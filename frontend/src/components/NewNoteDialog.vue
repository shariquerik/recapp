<template>
  <Dialog
    :options="{
      actions: [
        { label: 'Create', appearance: 'primary', handler: create_note },
        { label: 'Cancel' },
      ],
      size: '2xl',
    }"
    v-model="store.show_new_dialog"
  >
    <template #body-title>
      <h2 class="text-2xl font-semibold mb-4">Create New Note</h2>
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
          editor-class="prose-sm border max-w-none rounded-b-lg p-2 overflow-auto h-64 focus:outline-none"
          :fixedMenu="true"
          :content="note.description"
          @change="(val) => (note.description = val)"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { Dialog, Input, TextEditor } from 'frappe-ui'
import { ref } from 'vue'
import { notes } from '../data/notes'
import { useStore } from '../store'

let store = useStore()

let note = ref({
  title: '',
  description: '',
  link: '',
})

function create_note() {
  notes.insert
    .submit({
      title: note.value.title,
      description: note.value.description,
      link: note.value.link,
      date: store.new_dailog_date,
    })
    .then(() => {
      notes.reload()
      note.value = {
        title: '',
        description: '',
        link: '',
      }
      store.show_new_dialog = false
    })
}
</script>
