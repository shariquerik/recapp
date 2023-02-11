import { createApp } from 'vue'
import { FrappeUI, Button, setConfig, frappeRequest } from 'frappe-ui'
import router from './router'
import App from './App.vue'
import './index.css'
import { dayjs } from './utils'

setConfig('resourceFetcher', frappeRequest)

let app = createApp(App)
app.use(router)
app.use(FrappeUI)
app.component('Button', Button)

app.config.unwrapInjectedRef = true
app.config.globalProperties.$dayjs = dayjs
app.mount('#app')

if (import.meta.env.DEV) {
  window.$dayjs = dayjs
}
