import { createApp } from 'vue'
import { FrappeUI, Button, setConfig, frappeRequest } from 'frappe-ui'
import router from './router'
import App from './App.vue'
import './index.css'
import { dayjs } from './utils'
import { createDialog } from './utils/dialogs'

setConfig('resourceFetcher', frappeRequest)

let app = createApp(App)
app.use(router)
app.use(FrappeUI)
app.component('Button', Button)

app.config.unwrapInjectedRef = true
app.config.globalProperties.$dayjs = dayjs
app.config.globalProperties.$dialog = createDialog
app.mount('#app')

if (import.meta.env.DEV) {
  window.$dayjs = dayjs
  window.$dialog = createDialog
}
