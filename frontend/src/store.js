import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';

export const useStore = defineStore('recapp-store', () => {
  const route = useRoute()

  let current_view = computed(() => route.name || 'Daily')
  return {
    current_view,
  }
})
