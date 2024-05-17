import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './routers/router'
import axios from 'axios'
import { createPinia } from 'pinia'
import VueEcharts from 'vue-echarts'
//Add axios to window object to use it in console for testing purposes 
window.axios = axios;
// Add a request interceptor to add the token to the request headers
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

createApp(App).use(createPinia()).use(router).component('v-chart', VueEcharts).mount('#app');
