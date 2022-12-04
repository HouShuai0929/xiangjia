// pages/profile/index.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onLoad() {
    // 从本地获取用户信息
    this.setData({ userInfo: wx.getStorageSync('userInfo') })
  },
  getUserNickName(ev) {
    // 获取用户的昵称内容
    this.updateNickName(ev.detail.value)
  },
  async updateNickName(nickName) {
    // 请求数据接口
    const res = await wx.http.put('/userInfo', { nickName })
    // 检测接口调用的结果
    if (res.code !== 10000) return wx.utils.toast('更新用户信息失败!')
    // 保存用户昵称
    this.setData({ 'userInfo.nickName': nickName })
  },
  getUserAvatar(ev) {
    // 获取头像
    this.updateUserAvatar(ev.detail.avatarUrl)
  },
  updateUserAvatar(avatarUrl) {
    // 调用接口上传图片
    wx.uploadFile({
      url: wx.http.baseURL + '/upload',
      filePath: avatarUrl,
      name: 'file',
      header: {
        Authorization: getApp().token,
      },
      formData: {
        type: 'avatar',
      },
      success: (res) => {
        // 转换 json 数组
        const data = JSON.parse(res.data)
        // 检测接口调用结果
        if (data.code !== 10000) return wx.utils.toast('更新头像失败!')

        // 保存并预览图片地址
        this.setData({ 'userInfo.avatar': data.data.url })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})