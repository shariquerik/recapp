<script setup>
import { Dialogs } from '@/utils/dialogs'
import { useRoute } from 'vue-router'
import { session } from './data/session.js'
import { users } from './data/users.js'
import { notes } from './data/notes.js'
import { ref } from 'vue'
import { Avatar, DatePicker, Dropdown, FeatherIcon } from 'frappe-ui'
import NewNoteDialog from './components/NewNoteDialog.vue'
import UpdateNoteDialog from './components/UpdateNoteDialog.vue'
import { useStore } from './store.js'

let route = useRoute()
let store = useStore()

let dropdownItems = [
  {
    label: 'Log out',
    icon: 'log-out',
    handler: () => session.logout.submit(),
  },
]

let sidebar_width = ref(parseInt(localStorage.getItem('sidebarWidth') || 256))
let sidebar_resizing = ref(false)

function start_resize() {
  document.addEventListener('mousemove', resize)
  document.addEventListener('mouseup', () => {
    document.body.classList.remove('select-none')
    document.body.classList.remove('cursor-col-resize')
    localStorage.setItem('sidebarWidth', sidebar_width.value)
    sidebar_resizing.value = false
    document.removeEventListener('mousemove', resize)
  })
}

function resize(e) {
  sidebar_resizing.value = true
  document.body.classList.add('select-none')
  document.body.classList.add('cursor-col-resize')
  sidebar_width.value = e.clientX

  // snap to 256
  let range = [256 - 10, 256 + 10]
  if (sidebar_width.value > range[0] && sidebar_width.value < range[1]) {
    sidebar_width.value = 256
  }

  if (sidebar_width.value < 12 * 16) {
    sidebar_width.value = 12 * 16
  }
  if (sidebar_width.value > 24 * 16) {
    sidebar_width.value = 24 * 16
  }
}

let views = ['Daily', 'Weekly']

users.fetch()
notes.list.fetch()
</script>

<template>
  <div class="flex w-full h-screen">
    <div
      class="sidebar flex flex-col justify-between gap-2 bg-gray-50 p-6 relative"
      :style="{ width: `${sidebar_width}px` }"
    >
      <div
        :class="['sidebar-resizer', sidebar_resizing ? 'resizing' : '']"
        class="bg-gray-300"
        @mousedown="start_resize"
      />
      <div>
        <div
          class="flex items-center sidebar-header cursor-pointer"
          @click="store.date_changed = ''"
        >
          <div class="logo border border-2 border-blue-600 rounded-md p-1 mr-2">
            <FeatherIcon
              name="repeat"
              :stroke-width="2"
              class="h-5 w-5 text-blue-600"
            />
          </div>
          <h1 class="sidebar-title text-4xl text-blue-600">Recapp</h1>
        </div>
        <div class="border-b border-gray-300 my-6"></div>
        <div class="flex justify-between gap-2">
          <DatePicker
            v-model="store.date_changed"
            placeholder="Select Date"
            :formatValue="(val) => val.split('-').reverse().join('-')"
          />
          <Button @click="(store.date_changed = '')">Today</Button>
        </div>
        <div class="border-b border-gray-300 my-6"></div>
        <div class="sidebar-menu flex flex-col gap-2">
          <router-link
            v-for="view in views"
            class="px-2 py-1 rounded-md text-lg"
            :class="
              view == store.current_view
                ? 'bg-gray-200 hover:bg-gray-200'
                : 'hover:bg-gray-100'
            "
            :to="
              '/' +
              view.toLowerCase() +
              (route.params.date ? '/' + route.params.date : '')
            "
            >{{ view }}</router-link
          >
        </div>
      </div>
      <div class="sidebar-footer">
        <Dropdown placement="center" :options="dropdownItems">
          <template v-slot="{ open }">
            <div
              class="flex cursor-pointer items-center gap-2 rounded-md p-2 truncate break-all mt-2"
              :class="open ? 'bg-gray-300' : 'hover:bg-gray-200'"
            >
              <Avatar
                v-if="store.user"
                :label="store.user.full_name"
                :imageURL="store.user.user_image"
                size="md"
              />

              <div v-if="store.user">
                <h3 class="text-base font-semibold">
                  {{ store.user.full_name }}
                </h3>
                <p class="text-xs text-gray-600">{{ store.user.email }}</p>
              </div>

              <FeatherIcon
                :name="open ? 'chevron-up' : 'chevron-down'"
                class="h-4 w-4 ml-4"
              />
            </div>
          </template>
        </Dropdown>
      </div>
    </div>
    <div class="main flex-1 p-6">
      <div class="head flex justify-center items-center">
        <Button @click="store.change_to_previous_date">
          <FeatherIcon
            name="chevron-left"
            :stroke-width="2"
            class="h-5 w-5 text-gray-600 cursor-pointer"
          />
        </Button>
        <div class="px-2 py-0.5 flex-1 text-center text-gray-600 text-2xl">
          {{ store.date_text }}
        </div>
        <Button @click="store.change_to_next_date">
          <FeatherIcon
            name="chevron-right"
            :stroke-width="2"
            class="h-5 w-5 text-gray-600 cursor-pointer"
          />
        </Button>
      </div>
      <div class="border-b border-gray-200 my-6"></div>
      <div
        class="notes flex justify-center overflow-y-auto"
        :style="{ height: 'calc(100vh - 8rem)' }"
      >
        <router-view />
      </div>
    </div>
  </div>
  <Dialogs />
  <NewNoteDialog v-model:show="store.show_new_dialog" />
  <UpdateNoteDialog v-model:show="store.show_edit_dialog" />
</template>

<style scoped>
.sidebar-resizer {
  position: absolute;
  top: 0;
  right: -4px;
  width: 5px;
  height: 100%;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 10;
  cursor: col-resize;
}

.sidebar-resizer.resizing,
.sidebar-resizer:hover {
  opacity: 1;
}
</style>
