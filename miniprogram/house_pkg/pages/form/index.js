Page({
  data: {
    gender: 0,
    name: '',
    mobile: '',
    idcardFrontUrl: '',
    idcardBackUrl: '',
  },
  onLoad({ point, building, room, id }) {
    if (id) {
      wx.setNavigationBarTitle({ title: '编辑房屋信息' })
      this.getHouseDetail(id)
    } else {
      this.setData({ point, building, room })

    }
  },
 async getHouseDetail(id) {
    if (!id) return
    // 请求数据接口
    const { code, data: houseDetail } = await wx.http.get('/room/' + id)
    // 检测接口返回的结果
    if (code !== 10000) return wx.utils.toast()
    // 渲染数据
    this.setData({ ...houseDetail })
  },
  goList() {
    wx.reLaunch({
      url: '/house_pkg/pages/list/index',
    })
  },
  removePicture(ev) {
    // 移除图片的类型（身份证正面或反面）
    const type = ev.mark.type
    this.setData({ [type]: '' })
  },
  // 身份证上传
  async uploadPicture(ev) {
    const media = await wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sizeType: ['compressed']
    })
    wx.uploadFile({
      url: wx.http.baseURL + '/upload',
      filePath: media.tempFiles[0].tempFilePath,
      name: 'file',
      header: {
        Authorization: getApp().token,
      },
      success: (res) => {
        const data = JSON.parse(res.data)
        if (data.code !== 10000) return wx.utils.toast('上传图像失败!')
        this.setData({
          [ev.mark.type]: data.data.url
        })
      }
    })
  },
  // 验证业主姓名
  verifyName() {
    // 验证业主姓名（必须为汉字）
    const reg = /^[\u4e00-\u9fa5]{2,5}$/
    // 验证业主姓名
    const valid = reg.test(this.data.name.trim())
    // 验证结果提示
    if (!valid) wx.utils.toast('请填写真实中文姓名!')
    // 返回验证结果
    return valid
  },
  verifyMobile() {
    // 验证手机号
    const reg = /^[1][3-8][0-9]{9}$/
    const valid = reg.test(this.data.mobile)
    // 验证结果提示
    if (!valid) wx.utils.toast('请填写正确的手机号码!')
    // 返回验证结果
    return valid
  },
  verifyPicture() {
    // 图片地址不能为空
    const valid = !!this.data.idcardBackUrl && !!this.data.idcardFrontUrl
    // 验证结果提示
    if (!valid) wx.utils.toast('请上传身份证照片!')
    // 返回验证结果
    return valid
  },
  async submitFrom() {
    if (!this.verifyName()) return
    if (!this.verifyMobile()) return
    if (!this.verifyPicture()) return
    // 删除一些数据
    delete this.data.__webviewId__
    delete this.data.status
    // 请求数据接口
    const { code } = await wx.http.post('/room', this.data)
    // 检测接口调用的结果
    if (code !== 10000) return wx.utils.toast('添加房屋失败!')

    // 成功后跳转至房屋列表
    wx.navigateBack({
      delta: this.data.id ? 2 : 4,
    })
  }
})
