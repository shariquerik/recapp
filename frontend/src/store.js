import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { session } from './data/session'
import { users } from './data/users'

export const useStore = defineStore('recapp-store', () => {
  const route = useRoute()

  let current_view = computed(() => route.name || 'Daily')
  let user = computed(() => {
    return users.data?.find((user) => user.name == session.user)
  })
  return {
    current_view,
    user
  }
})
