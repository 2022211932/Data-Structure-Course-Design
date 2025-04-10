import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import axios from 'axios'

// 设置axios默认配置
axios.defaults.baseURL = process.env.BASE_URL || '/'

// 设置axios请求超时时间
axios.defaults.timeout = 10000

const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 将axios设置为全局属性
app.config.globalProperties.$axios = axios

app.use(store)
app.use(router)

// 确保ElMessage可以通过this.$message访问
app.config.globalProperties.$message = ElementPlus.ElMessage

app.use(ElementPlus)

app.mount('#app') 