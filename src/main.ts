import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import './index.css'
// 导入自定义主题样式，确保它在其他样式之后导入以覆盖默认样式
import { preloadOnAppStart } from '@/util/preload'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.mount('#app')

// Kick off preloading after initial mount so it doesn't block first paint
preloadOnAppStart()
