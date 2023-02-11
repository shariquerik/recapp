<template>
  <Dialog
    :options="{
      actions: [
        { label: 'Create', appearance: 'primary', handler: create_note },
        { label: 'Cancel' },
      ],
      size: '2xl',
    }"
    v-model="open"
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
        <span class="-mb-2 block text-sm leading-4 text-gray-700">Description</span>
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
import { ref, computed } from 'vue'
import { notes } from '../data/notes'

const emit = defineEmits(['update:show'])
const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
})

let open = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value),
})

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
      date: props.date,
    })
    .then(() => {
      notes.reload()
      note.value = {
        title: '',
        description: '',
        link: '',
      }
      open.value = false
    })
}
</script>
