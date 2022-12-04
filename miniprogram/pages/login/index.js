let secret_code = ''
const app = getApp()
Page({
  data: {
    mobile: '17719123102',
    countDownVisible: false,
    code: ''
  },
  onLoad({ redirectURL }) {
    // 获取地址参数
    this.setData({ redirectURL })
  },
  countDownChange(e) {
    this.setData({
      timeData: e.detail,
      countDownVisible: e.detail.seconds > 0 || e.detail.minutes === 1,
    })
  },
  // 验证手机号格式
  verifyMobile() {
    // 宽松的验证规则
    const reg = /^[1][3-8][0-9]{9}$/
    // 正则验证（去除两端空格）
    const valid = reg.test(this.data.mobile.trim())
    // 验证结果提示
    if (!valid) wx.utils.toast('请填写正确的手机号码!')
    // 返回验证结果
    return valid
  },
  // 获取短信验证码
  async getCode() {
    // 验证手机号码格式是否正确
    if (!this.verifyMobile()) return
    // 请求数据接口
    const { code, data } = await wx.http.get('/code', { mobile: this.data.mobile.trim() })
    // 验证接口返回结果
    if (code !== 10000) return wx.uitls.toast('发送失败, 请稍后重试!')
    // 发送验证码成功
    wx.utils.toast('发送成功, 请查收短信!')
    // 开始倒计时
    this.setData({ countDownVisible: true })
    // 记录验证码等待复制到粘贴板（仅用于测试环境）
    secret_code = data.code
  },
  // 复制验证码到粘贴板
  copyCode() {
    wx.setClipboardData({ data: secret_code })
  },
  verifyCode() {
    const reg = /^\d{6}$/
    const valid = reg.test(this.data.code.trim())
    if (!valid) wx.utils.toast('请检查验证码是否正确!')
    return valid
  },
  // 提交数据完成登录
  async submitForm() {
    // 逐个验证表单数据
    if (!this.verifyMobile()) return
    if (!this.verifyCode()) return
    // 用户填写的手机号和验证码
    const { mobile, code } = this.data
    // 调用接口登录/注册
    const res = await wx.http.post('/login', { mobile, code })
    // 校验数据是否合法
    if (res.code !== 10000) return wx.utils.toast('请检查验证码是否正确!')
    // 调用app里的方法
    app.setToken(res.data.token,res.data.refreshToken)
     // 重定向至登录前的页面
     wx.redirectTo({
      url: this.data.redirectURL,
    })
  },
})
