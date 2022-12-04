Page({
  goLogin() {
    wx.navigateTo({
      url: '/pages/login/index',
    })
  },
  onShow() {
    this.getUserInfo()
  },
  async getUserInfo() {
    try {
      const { code, data: userInfo } = await wx.http.get('/userInfo')
      if (code !== 10000) return wx.utils.toast('数据加载失败,请稍后重试')
      this.setData({ userInfo })
      // 将用户信息存入本地
      wx.setStorageSync('userInfo', userInfo)
    } catch (err) {
      console.log('数据获取失败');
    }
  }
})
