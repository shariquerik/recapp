<script setup>
import { Dialogs } from '@/utils/dialogs'
import { useRoute } from 'vue-router'
import { session } from './data/session.js'
import { users } from './data/users.js'
import { ref } from 'vue'
import { Avatar, Dropdown, FeatherIcon } from 'frappe-ui'
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

let views = ['Daily', 'Weekly', 'Monthly']

users.fetch()
</script>

<template>
  <div>
    <div class="flex w-full h-screen">
      <div
        class="sidebar flex flex-col justify-between gap-2 bg-gray-50 p-4 relative"
        :style="{ width: `${sidebar_width}px` }"
      >
        <div
          :class="['sidebar-resizer', sidebar_resizing ? 'resizing' : '']"
          class="bg-gray-300"
          @mousedown="start_resize"
        />
        <div>
          <div class="sidebar-header">
            <h1 class="sidebar-title text-4xl">Recapp</h1>
          </div>
          <div class="border-b border-gray-300 my-2"></div>
          <div class="sidebar-menu flex flex-col gap-2">
            <router-link
              v-for="view in views"
              class="px-2 py-1 rounded-md"
              :class="view == store.current_view ? 'bg-gray-200 hover:bg-gray-200' : 'hover:bg-gray-100'"
              :to="'/' + view.toLowerCase() + '/' + route?.params?.date"
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
      <div class="main flex-1">
        <router-view />
      </div>
    </div>
  </div>
  <Dialogs />
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
