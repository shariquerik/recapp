<template>
  <div class="flex justify-center h-screen bg-gray-100">
    <div class="p-6 w-full overflow-hidden">
      <!-- <div class="flex justify-between py-3">
        <div class="text-3xl font-semibold">Daily</div>
        <div class="flex gap-2">
          <Button appearance="primary">Daily</Button>
          <Button>Weekly</Button>
          <Button>Monthly</Button>
        </div>
      </div> -->
      <div class="bg-white rounded-lg drop-shadow-sm">
        <div
          class="head flex justify-center items-center border-b border-gray-200"
        >
          <Button class="m-2" @click="change_to_previous_date">
            <FeatherIcon
              name="chevron-left"
              stroke-width="2"
              class="h-4 w-4 text-gray-900 cursor-pointer"
            />
          </Button>
          <div class="px-2 py-1 flex-1 text-center text-gray-900 text-2xl mx-6">
            {{ date_text }}
          </div>
          <Button class="m-2" @click="change_to_next_date">
            <FeatherIcon
              name="chevron-right"
              stroke-width="2"
              class="h-4 w-4 text-gray-900 cursor-pointer"
            />
          </Button>
        </div>
        <div
          class="notes flex justify-center overflow-y-auto"
          :style="{ height: 'calc(100vh - 6rem)' }"
        >
          <draggable
            v-if="notes_list.length"
            v-model="notes_list"
            handle=".note-drag-handle"
            :animation="200"
            easing="cubic-bezier(0.34, 1.56, 0.64, 1)"
            item-key="id"
          >
            <template #item="{ element, index }">
              <div
                class="group flex items-center py-2 last:mb-0 cursor-pointer"
              >
                <Note @open_new_dialog="open_new_dialog" :note="element" />
              </div>
            </template>
          </draggable>
          <div
            v-else
            class="flex flex-col gap-2 justify-center items-center h-full"
          >
            <div class="text-gray-500 text-xl">No notes found</div>
            <Button
              class="ml-2"
              appearance="primary"
              @click="show_new_dialog = true"
              >+ Add Note</Button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
  <Dialog
    :options="{
      actions: [
        { label: 'Create', appearance: 'primary', handler: create_note },
        { label: 'Cancel' },
      ],
      size: '2xl',
    }"
    v-model="show_new_dialog"
  >
    <template #body-title>
      <h2 class="text-2xl font-semibold mb-4">Create New Note</h2>
    </template>
    <template #body-content>
      <div class="flex flex-col gap-4">
        <Input
          label="Title"
          placeholder="Note Title"
          v-model="new_note.title"
        />
        <Input
          iconLeft="link"
          label="Link"
          placeholder="Note Link"
          v-model="new_note.link"
        />
        <span class="-mb-2 block text-sm leading-4 text-gray-700"
          >Description</span
        >
        <TextEditor
          editor-class="prose-sm border max-w-none rounded-b-lg p-2 overflow-auto h-64 focus:outline-none"
          :fixedMenu="true"
          :content="new_note.description"
          @change="(val) => (new_note.description = val)"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { FeatherIcon, Button, Dialog, Input, TextEditor } from 'frappe-ui'
import Note from '../components/Note.vue'
import { notes, getNotes } from '../data/notes'
import draggable from 'vuedraggable'
import { ref, computed } from 'vue'

const show_new_dialog = ref(false)

function open_new_dialog() {
  show_new_dialog.value = true
}

let new_note = ref({
  title: '',
  description: '',
  link: '',
})

function create_note() {
  notes.insert.submit(
    {
      title: new_note.value.title,
      description: new_note.value.description,
      link: new_note.value.link,
      date: today.value,
    },
    {
      onSuccess: (note) => {
        notes.reload()
        new_note.value = {
          title: '',
          description: '',
          link: '',
        }
        show_new_dialog.value = false
      },
    }
  )
}

let date = ref('')

const today = computed(() => {
  if (date.value) {
    return $dayjs(date.value).format('YYYY-MM-DD')
  }
  return $dayjs().format('YYYY-MM-DD')
})

const date_text = computed(() => {
  if (date.value) {
    return $dayjs(date.value).format('dddd - D MMMM, YYYY')
  }
  return $dayjs().format('dddd - D MMMM, YYYY')
})

function change_to_previous_date() {
  date.value = $dayjs(today.value).subtract(1, 'day').format('YYYY-MM-DD')
}

function change_to_next_date() {
  date.value = $dayjs(today.value).add(1, 'day').format('YYYY-MM-DD')
}

let notes_list = computed(() => getNotes(today.value));
</script>
