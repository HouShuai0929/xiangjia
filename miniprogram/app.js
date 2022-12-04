// app.js
import './utils/utils'
import './utils/http'
App({
  globalData: {},
  token: '',
  refresh_token: '',
  onLaunch() {
    this.getToken('token')
    this.getToken('refresh_token')
  },
  getToken(key) {
    wx.getStorage({
      key,
      success: ({ data }) => { this[key] = data },
      fail: () => { },
      complete: () => { }
    });
  },
  setToken(token, refresh_token) {
    // 拼凑合法token格式
    token = 'Bearer ' + token
    refresh_token = 'Bearer ' + refresh_token

    // 本地存储 token 和 refresh_token
    wx.setStorageSync('token', token)
    wx.setStorageSync('refresh_token', refresh_token)

    // 更新全局 token 和 refresh_token
    this.token = token
    this.refresh_token = refresh_token

  },
})
