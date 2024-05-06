import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './routers/router'
import axios from 'axios'

window.axios = axios; //Add axios to window object to use it in console for testing purposes 

createApp(App).use(router).mount('#app');
