<template>
  <Dialog
    :options="{
      actions: [
        { label: 'Create', variant: 'solid', onClick: create_note },
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
        <FormControl
          type="text"
          label="Title"
          placeholder="Note Title"
          v-model="note.title"
        >
          <template #prefix>
            <FeatherIcon name="type" class="h-3.5 w-3.5 text-gray-600" />
          </template>
        </FormControl>
        <FormControl
          type="text"
          label="Link"
          placeholder="Note Link"
          v-model="note.link"
        >
          <template #prefix>
            <FeatherIcon name="link" class="h-3.5 w-3.5 text-gray-600" />
          </template>
        </FormControl>
        <span class="-mb-2.5 block text-xs text-gray-600">Description</span>
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
import { Dialog, TextEditor, FormControl, FeatherIcon } from 'frappe-ui'
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
