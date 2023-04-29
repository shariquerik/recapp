<script setup>
import { Dialogs } from '@/utils/dialogs'
import { useStore } from './store.js'
import { useRoute, useRouter } from 'vue-router';
import { session } from './data/session.js'

let store = useStore()
let route = useRoute()
let router = useRouter()

function change_view(view) {
  let date = route.params.date
  router.push('/'+ view.toLowerCase() + '/' + date)
}

let views = ['Daily', 'Weekly', 'Monthly']
</script>

<template>
  <router-view v-if="['Login'].includes(route.name)" />
  <div v-else>
    <div class="flex justify-center h-screen bg-gray-100">
      <div class="p-6 w-full overflow-hidden">
        <div class="flex justify-between py-3">
          <div class="flex gap-2">
            <div v-for="view in views">
              <Button
                :class="[
                  view == store.current_view
                    ? 'bg-gray-500 text-white hover:bg-gray-600'
                    : '',
                ]"
                @click="change_view(view)"
                >{{ view }}</Button
              >
            </div>
          </div>
          <div class="text-xl">{{ session.user }}</div>
        </div>
        <div class="bg-white rounded-lg drop-shadow-sm">
          <router-view />
        </div>
      </div>
    </div>
  </div>
  <Dialogs />
</template>
