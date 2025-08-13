import { createApp } from 'vue'
import { pinia } from './stores'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import './index.css'
import { useOpenIdStore } from './stores/openId'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(ElementPlus)
// Initialize openId early so it is available to all routes and requests
const openIdStore = useOpenIdStore()
openIdStore.initializeFromUrlOrStorage()
app.mount('#app')
