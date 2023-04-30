import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { session } from './data/session'
import { users } from './data/users'
import { dayjs } from './utils'

export const useStore = defineStore('recapp-store', () => {
  const route = useRoute()
  const router = useRouter()

  let date_format = ref('YYYY-MM-DD')
  let current_view = computed(() => route.name || 'Daily')

  let user = computed(() =>
    users.data?.find((user) => user.name == session.user)
  )

  let date = computed(() => {
    if (route.params.date && dayjs(route.params.date).isValid()) {
      return dayjs(route.params.date).format(date_format.value)
    }
    return dayjs().format(date_format.value)
  })

  let today = computed(() => {
    if (date.value) {
      return dayjs(date.value).format(date_format.value)
    }
    return dayjs().format(date_format.value)
  })

  let date_changed = ref(null)

  watch(date_changed, (val) => {
    router.push('/' + current_view.value.toLowerCase() + (val ? '/' + val : ''))
  })

  // View Header
  let date_text = computed(() => {
    if (current_view.value == 'Daily') {
      return dayjs(today.value).format('dddd - D MMMM, YYYY')
    } else if (current_view.value == 'Weekly') {
      let start_date = dayjs(today.value).startOf('week').format('D MMMM')
      let end_date = dayjs(today.value).endOf('week').format('D MMMM, YYYY')
      return `${start_date} - ${end_date}`
    }
  })

  function change_to_previous_date() {
    let duration = current_view.value == 'Daily' ? 1 : 7
    let to_date = dayjs(today.value)
      .subtract(duration, 'day')
      .format(date_format.value)
    date_changed.value = to_date
  }

  function change_to_next_date() {
    let duration = current_view.value == 'Daily' ? 1 : 7
    let to_date = dayjs(today.value)
      .add(duration, 'day')
      .format(date_format.value)
    date_changed.value = to_date
  }

  // New Note Dialog
  let show_new_dialog = ref(false)
  let new_dailog_date = ref(today.value)

  function open_new_dialog(e, d) {
    show_new_dialog.value = true
    new_dailog_date.value = d ? d : today.value
  }

  // Edit Note Dialog
  let show_edit_dialog = ref(false)
  let edit_dailog_note = ref(null)

  function open_edit_dialog(note) {
    show_edit_dialog.value = true
    edit_dailog_note.value = note
  }

  return {
    current_view,
    user,
    date_format,
    date,
    today,
    show_new_dialog,
    new_dailog_date,
    show_edit_dialog,
    edit_dailog_note,
    date_text,
    date_changed,
    change_to_previous_date,
    change_to_next_date,
    open_new_dialog,
    open_edit_dialog,
  }
})
