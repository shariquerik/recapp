<template>
  <div class="flex justify-center h-screen bg-gray-100">
    <div class="p-6 w-full overflow-hidden">
      <div class="flex justify-between py-3">
        <div class="text-3xl font-semibold">Daily</div>
        <div class="flex gap-2">
          <Button appearance="primary">Daily</Button>
          <Button @click="switch_to_weekly">Weekly</Button>
          <Button>Monthly</Button>
        </div>
      </div>
      <div class="bg-white rounded-lg drop-shadow-sm">
        <div
          class="head flex justify-center items-center border-b border-gray-200"
        >
          <Button class="m-2" @click="change_to_previous_date">
            <FeatherIcon
              name="chevron-left"
              :stroke-width="2"
              class="h-4 w-4 text-gray-900 cursor-pointer"
            />
          </Button>
          <div class="px-2 py-1 flex-1 text-center text-gray-900 text-2xl mx-6">
            {{ date_text }}
          </div>
          <Button class="m-2" @click="change_to_next_date">
            <FeatherIcon
              name="chevron-right"
              :stroke-width="2"
              class="h-4 w-4 text-gray-900 cursor-pointer"
            />
          </Button>
        </div>
        <div
          class="notes flex justify-center overflow-y-auto"
          :style="{ height: 'calc(100vh - 9rem)' }"
        >
          <div
            v-if="notes_data?.length === 0"
            class="flex flex-col gap-2 justify-center items-center h-full"
          >
            <div class="text-gray-500 text-xl">No notes found</div>
            <Button class="ml-2" appearance="primary" @click="open_new_dialog">
              + Add Note
            </Button>
          </div>
          <draggable
            v-else
            v-model="notes_data"
            handle=".note-drag-handle"
            :animation="200"
            easing="cubic-bezier(0.34, 1.56, 0.64, 1)"
            item-key="name"
            @end="update_note_sequence(notes_data)"
          >
            <template #item="{ element, index }">
              <div
                class="group flex items-center py-2 last:mb-0 cursor-pointer"
              >
                <Note @open_new_dialog="open_new_dialog" :note="element" />
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>
  </div>
  <NewNoteDialog :date="today" v-model:show="show_new_dialog" />
</template>

<script setup>
import { FeatherIcon, Button } from 'frappe-ui'
import Note from '../components/Note.vue'
import NewNoteDialog from '../components/NewNoteDialog.vue'
import { getNotes, update_note_sequence } from '../data/notes'
import draggable from 'vuedraggable'
import { useRoute, useRouter } from 'vue-router'
import { ref, computed, watch, onMounted, inject } from 'vue'

const show_new_dialog = ref(false)

let dayjs = inject('$dayjs')

function open_new_dialog() {
  show_new_dialog.value = true
}
let route = useRoute()
let router = useRouter()

let date = ref('')
if (route.params.date) {
  if (dayjs(route.params.date).isValid()) {
    date.value = route.params.date
  } else {
    date.value = dayjs().format('YYYY-MM-DD')
  }
}

function switch_to_weekly() {
  router.push('/weekly/' + date.value)
}

const today = computed(() => {
  if (date.value) {
    return dayjs(date.value).format('YYYY-MM-DD')
  }
  return dayjs().format('YYYY-MM-DD')
})

const date_text = computed(() => {
  return dayjs(today.value).format('dddd - D MMMM, YYYY')
})

function change_to_previous_date() {
  date.value = dayjs(today.value).subtract(1, 'day').format('YYYY-MM-DD')
  router.push('/daily/' + date.value)
}

function change_to_next_date() {
  date.value = dayjs(today.value).add(1, 'day').format('YYYY-MM-DD')
  router.push('/daily/' + date.value)
}

let notes_data = ref([])

watch(
  () => getNotes(today.value),
  (val) => {
    notes_data.value = val
  }
)

onMounted(() => {
  notes_data.value = getNotes(today.value)
})
</script>
