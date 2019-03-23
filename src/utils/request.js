import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import configPath from '@/configs/path'

// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// 创建axios实例
const service = axios.create({
  baseURL: configPath.successServer, // api 的 base_url
  // timeout: 5000, // 请求超时时间
  headers:{'token': 'eyJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiIxMjM0NTYiLCJzdWIiOiJ7XCJ1c2VyXCI6e1wiaW52aXRlY29kZVwiOlwid2cyeWxkM3g1clwiLFwiaWRcIjoyNjczLFwiaXNsb2NrXCI6MCxcIm1vYmlsZVwiOlwiMTg1MDE5NTc0ODZcIixcInJlZ2lzdGVydGltZVwiOlwiMjAxOS0wMS0yNSAwODo1MFwiLFwiaW50ZWdyYXRpb25cIjoxMCxcInVwZGF0ZXRpbWVcIjpcIjIwMTktMDEtMjUgMDg6NTBcIixcInVzZXJuYW1lXCI6XCJjaGVuaGFuXCJ9fSIsInVzZXJfbmFtZSI6ImFkbWluIiwibmlja19uYW1lIjoiWC1yYXBpZG8iLCJpc3MiOiJBbnNvbiIsImlhdCI6MTU1Mjg4MDkyOSwianRpIjoiZDhiZTg5ODctM2EzNC00Mjk0LTliMDctZGJmMzRiNDAzOTk1In0.7zqIY86Xs0REj9zrM1IxISbo_Fbr8ItTKzLFEMI0uB8'},
  transformRequest: [function (data) {
    let newData = new URLSearchParams()
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        if (data[key] !== undefined) {
          if (Array.isArray(data[key])) {
            let temp = ''
            for(let i in data[key]) {
              temp += (JSON.stringify(data[key][i]) + ',')
            }
            data[key] = temp
          }else{
            typeof data[key] === 'string' || (data[key] = JSON.stringify(data[key])) // 防止字符串参数再被JSON套一层引号
          }
        }else{
          data[key] = ''
        }
        newData.append(key, data[key])
      }
    }
    return newData
  }],
})
// request拦截器
/*service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)*/

// response 拦截器
service.interceptors.response.use(
  response => {
    // code为非20000是抛错 可结合自己业务进行修改
    const res = response.data
    if (res.status === 'success') {
      return response
    } else {
      // 401:Token 过期了;
      if (res.status === 401) {
        MessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      } else {
        console.warn('err: ' + JSON.stringify(res)) // for debug
        Message({
          message: res,
          type: 'error',
          duration: 5 * 1000
        })
      }
      return Promise.reject('error')
    }
  },
  error => {
    console.warn('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
