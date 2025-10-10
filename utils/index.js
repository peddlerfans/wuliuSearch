// utils/request.js

// 基础配置
const config = {
  baseURL: 'https://your-api-domain.com/api', // 你的API基础地址
  timeout: 10000, // 请求超时时间
  header: {
    'Content-Type': 'application/json'
  }
}

// 请求队列（用于防止重复请求）
const pendingRequests = new Map()

// 生成请求key
function generateReqKey(config) {
  const { method, url, params, data } = config
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&')
}

// 添加请求到队列
function addPendingRequest(config) {
  const requestKey = generateReqKey(config)
  config.cancelToken = config.cancelToken || new Promise((resolve) => {
    const cancel = (msg) => {
      resolve(msg)
    }
    config.cancel = cancel
  })
  pendingRequests.set(requestKey, config.cancel)
}

// 移除请求
function removePendingRequest(config) {
  const requestKey = generateReqKey(config)
  if (pendingRequests.has(requestKey)) {
    const cancel = pendingRequests.get(requestKey)
    cancel('请求取消')
    pendingRequests.delete(requestKey)
  }
}

class Request {
  constructor(options = {}) {
    this.config = { ...config, ...options }
    this.interceptors = {
      request: [],
      response: []
    }
  }

  // 添加请求拦截器
  useRequestInterceptor(fulfilled, rejected) {
    this.interceptors.request.push({ fulfilled, rejected })
  }

  // 添加响应拦截器
  useResponseInterceptor(fulfilled, rejected) {
    this.interceptors.response.push({ fulfilled, rejected })
  }

  // 执行拦截器链
  async runInterceptors(interceptors, value) {
    for (const interceptor of interceptors) {
      try {
        value = await interceptor.fulfilled(value)
      } catch (error) {
        await interceptor.rejected(error)
        throw error
      }
    }
    return value
  }

  // 请求方法
  async request(options) {
    // 合并配置
    const requestOptions = { ...this.config, ...options }
    
    try {
      // 执行请求拦截器
      requestOptions = await this.runInterceptors(this.interceptors.request, requestOptions)
      
      // 添加请求到队列
      addPendingRequest(requestOptions)
      
      // 发起请求
      return new Promise((resolve, reject) => {
        uni.request({
          ...requestOptions,
          success: (res) => {
            // 移除请求
            removePendingRequest(requestOptions)
            
            // 执行响应拦截器
            this.runInterceptors(this.interceptors.response, res)
              .then(resolve)
              .catch(reject)
          },
          fail: (err) => {
            // 移除请求
            removePendingRequest(requestOptions)
            reject(err)
          }
        })
      })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // GET 请求
  get(url, params = {}, options = {}) {
    return this.request({
      url,
      method: 'GET',
      params,
      ...options
    })
  }

  // POST 请求
  post(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'POST',
      data,
      ...options
    })
  }

  // PUT 请求
  put(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'PUT',
      data,
      ...options
    })
  }

  // DELETE 请求
  delete(url, params = {}, options = {}) {
    return this.request({
      url,
      method: 'DELETE',
      params,
      ...options
    })
  }

  // 上传文件
  upload(url, filePath, formData = {}, options = {}) {
    return new Promise((resolve, reject) => {
      uni.uploadFile({
        url: this.config.baseURL + url,
        filePath,
        name: 'file',
        formData,
        ...options,
        success: (res) => {
          if (res.statusCode === 200) {
            try {
              const data = JSON.parse(res.data)
              resolve(data)
            } catch (e) {
              resolve(res.data)
            }
          } else {
            reject(new Error(`上传失败: ${res.statusCode}`))
          }
        },
        fail: reject
      })
    })
  }

  // 下载文件
  download(url, options = {}) {
    return new Promise((resolve, reject) => {
      uni.downloadFile({
        url: this.config.baseURL + url,
        ...options,
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.tempFilePath)
          } else {
            reject(new Error(`下载失败: ${res.statusCode}`))
          }
        },
        fail: reject
      })
    })
  }
}

// 创建请求实例
const request = new Request()

// 添加请求拦截器 - 添加token等
request.useRequestInterceptor(
  (config) => {
    // 添加认证token
    const token = uni.getStorageSync('token')
    if (token) {
      config.header = {
        ...config.header,
        'Authorization': `Bearer ${token}`
      }
    }
    
    // 显示加载提示
    if (config.showLoading !== false) {
      uni.showLoading({
        title: '加载中...',
        mask: true
      })
    }
    
    return config
  },
  (error) => {
    uni.hideLoading()
    return Promise.reject(error)
  }
)

// 添加响应拦截器 - 处理响应数据
request.useResponseInterceptor(
  (response) => {
    // 隐藏加载提示
    uni.hideLoading()
    
    const { statusCode, data } = response
    
    if (statusCode === 200) {
      // 根据你的API返回结构进行调整
      if (data.code === 0 || data.success) {
        return data.data || data
      } else {
        // 业务错误
        uni.showToast({
          title: data.message || '请求失败',
          icon: 'none'
        })
        return Promise.reject(new Error(data.message || '请求失败'))
      }
    } else if (statusCode === 401) {
      // 未授权，跳转到登录页
      uni.showToast({
        title: '登录已过期，请重新登录',
        icon: 'none'
      })
      uni.navigateTo({
        url: '/pages/login/login'
      })
      return Promise.reject(new Error('未授权'))
    } else {
      uni.showToast({
        title: `请求错误: ${statusCode}`,
        icon: 'none'
      })
      return Promise.reject(new Error(`HTTP错误: ${statusCode}`))
    }
  },
  (error) => {
    // 隐藏加载提示
    uni.hideLoading()
    
    // 网络错误处理
    if (error.errMsg && error.errMsg.includes('request:fail')) {
      uni.showToast({
        title: '网络连接失败，请检查网络',
        icon: 'none'
      })
    }
    
    return Promise.reject(error)
  }
)

export default request