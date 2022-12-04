// 导入 http 模块
import http from 'wechat-http'
/**
 * 配置接口基础路径
 */
http.baseURL = 'https://live-api.itheima.net'

// 数据过滤,只保留自己需要的data部分
http.intercept.response = (res) => { return res.data }
http.intercept.request = (params) => {
  const { token } = getApp()
  const defaultHeader = {}
  if (token) defaultHeader.Authorization = token
  params.header = Object.assign(defaultHeader, params.header)
  return params
}
http.intercept.response = async ({ statusCode, data, config }) => {
  // statusCode 为状态码
  if (statusCode === 401) {
    if (config.url.includes('/refreshToken')) {
      const pageStack = getCurrentPages()
      const lastPage = pageStack[pageStack.length - 1]
      const redirectURL = lastPage.route
      return wx.redirectTo({
        url: `/pages/login/index?redirectURL=/${redirectURL}`
      })
    }
    // 获取全局应用实例
    const app = getApp()
    if (!app.refresh_token) return
    // 使用 refreshToken 更新 token
    const res = await http({
      url: '/refreshToken',
      method: 'POST',
      header: {
        // 这时要注意使用的是 refresh_token
        Authorization: app.refresh_token,
      },
    })
    // 更新 token 和 refresh_token
    app.setToken(res.data.token, res.data.refreshToken)
    // 重新发起请求
    return http(
      Object.assign(config, {
        // 传递新的 token
        header: {
          Authorization: app.token,
        },
      })
    )
  }

  // 过滤接口返回的数据
  return data
}
/**
 * 挂载方法到全局
 */
wx.http = http
/**
 * 模块导出
 * 
 */
export default http
