import { createApp } from 'vue'
import { FrappeUI, Button, setConfig, frappeRequest } from 'frappe-ui'
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

app.config.unwrapInjectedRef = true
app.provide('$dayjs', dayjs)
app.provide('$dialog', createDialog)
app.mount('#app')

if (import.meta.env.DEV) {
  window.$dayjs = dayjs
  window.$dialog = createDialog
}
