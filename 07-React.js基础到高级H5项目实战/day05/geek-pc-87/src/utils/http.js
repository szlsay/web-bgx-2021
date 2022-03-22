/**
 * 配置 axios 对 axios 进行统一的处理
 */

import axios from 'axios'

import { getToken, removeToken } from './token'
import { history } from './history'

// 创建 axios 的实例，通过返回值拿到这个实例对象
const http = axios.create({
  // 基础路径
  baseURL: 'http://geek.itheima.net/v1_0/',
  // 超时时间
  timeout: 5000
})

// 使用 axios 的请求拦截器，统一添加 token
http.interceptors.request.use(config => {
  // console.log('请求拦截器', config)

  // 简单的处理方式：
  // 为所有的请求，添加 token
  // onfig.headers.Authorization = `Bearer ${getToken()}`

  // 严谨的的处理方式：
  // 如果是登录接口，不添加 token
  // 如果不是登录接口，再添加 token
  if (config.url !== '/authorizations') {
    config.headers.Authorization = `Bearer ${getToken()}`
  }

  // 注意：此处，不要忘记返回 config
  return config
})

// 使用 axios 的响应拦截器，来统一处理 token 失效的问题
http.interceptors.response.use(
  // 没有错误时，会走此处
  response => {
    // console.log('response', response)
    return response
  },

  // 如果是 token 失效，会走 error 而不是上面的回调
  error => {
    // console.log('error')
    console.dir(error)
    if (error.response.status === 401) {
      // 说明 token 失效了，此时，直接跳转到登录页面，引导用户登录
      // console.log('跳转到登录页面')
      // 移除 token
      removeToken()
      // 跳转到登录页面
      history.push('/login')
    }
    return error
  }
)

// 导出
export { http }
