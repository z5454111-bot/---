import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './store'

// 创建 Vue 应用实例
const app = createApp(App)

// 注册状态管理 (Pinia)
app.use(pinia)

// 注册路由 (Vue Router)
app.use(router)

// 挂载应用到 DOM
app.mount('#app')