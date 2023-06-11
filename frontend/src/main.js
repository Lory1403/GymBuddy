import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

const app = createApp(App)

app.config.globalProperties.$apiBaseUrl = 'https://gymbuddy-14b9.onrender.com';

app.use(router)

app.mount('#app')
