import Vue from 'vue'
import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'

axios.interceptors.request.use(config => {
  const token = sessionStorage.getItem('token')
  if (token !== null) {
    config.headers.Authorization = token
  }
  return config
})

Vue.prototype.$http = axios
