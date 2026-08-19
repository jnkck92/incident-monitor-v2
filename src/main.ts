import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import { initConfig } from './config'

const runtimeConfig = await fetch('/config.json')
  .then(r => r.json())
  .catch(() => ({}))

initConfig(runtimeConfig)

createApp(App).mount('#app')