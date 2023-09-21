import { createApp } from 'vue'
import { FrappeUI, Button, setConfig, frappeRequest, initSocket } from 'frappe-ui'
import router from './router'
import App from './App.vue'
import { createPinia } from "pinia";
import './index.css'
import { dayjs } from './utils'
import { createDialog } from './utils/dialogs'

setConfig('resourceFetcher', frappeRequest)

// create a pinia instance
let pinia = createPinia();

let app = createApp(App)
app.use(router)
app.use(FrappeUI)
app.use(pinia);
app.component('Button', Button)

app.provide('$dayjs', dayjs)
app.provide('$dialog', createDialog)
app.mount('#app')

initSocket().on('refetch_resource', (data) => {
  if (data.cache_key) {
    let resource =
      getCachedResource(data.cache_key) || getCachedListResource(data.cache_key)
    if (resource) {
      resource.reload()
    }
  }
})

if (import.meta.env.DEV) {
  window.$dayjs = dayjs
  window.$dialog = createDialog
}
