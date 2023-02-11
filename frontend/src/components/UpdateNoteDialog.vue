<template>
  <Dialog
    :options="{
      actions: [
        { label: 'Update', appearance: 'primary', handler: update_note },
        { label: 'Cancel' },
      ],
      size: '2xl',
    }"
    v-model="open"
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
import { computed } from 'vue'
import { notes } from '../data/notes'

const emit = defineEmits(['update:show'])
const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  note: {
    type: Object,
    required: true,
  },
})

let open = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value),
})

function update_note() {
  notes.setValue
    .submit({
      name: props.note.name,
      title: props.note.title,
      description: props.note.description,
      link: props.note.link,
    })
    .then(() => {
      notes.reload()
      open.value = false
    })
}
</script>
