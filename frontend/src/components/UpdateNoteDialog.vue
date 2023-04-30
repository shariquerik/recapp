<template>
  <Dialog
    :options="{
      actions: [
        { label: 'Update', appearance: 'primary', handler: update_note },
        { label: 'Cancel' },
      ],
      size: '2xl',
    }"
    v-model="store.show_edit_dialog"
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
        <span class="-mb-2 block text-sm leading-4 text-gray-700">Description</span>
        <TextEditor
          editor-class="prose-sm border max-w-none rounded-b-lg p-2 overflow-auto h-40 focus:outline-none"
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
import { useStore } from '../store';
import { notes } from '../data/notes'
import { computed } from 'vue';

let store = useStore()

let note = computed(() => store.edit_dailog_note)

function update_note() {
  notes.setValue
    .submit({
      name: note.value.name,
      title: note.value.title,
      description: note.value.description,
      link: note.value.link,
    })
    .then(() => {
      notes.reload()
      store.show_edit_dialog = false
    })
}
</script>
