Page({
  data: {
    currentDate: new Date().getTime(),
    houseLayerVisible: false,
    repairLayerVisible: false,
    dateLayerVisible: false,
    houseList: [],
    repairItem: [],
    attachment: [],
    houseInfo: '',
    repairItemName: '',
    appointment: '',
    mobile: '',
    description: '',
    houseId: '',
    repairItemId: ''
  },
  onLoad({id}) {
    // 获取房屋列表
    this.getHouseList()
    this.getRepairItem()
    if (id) {
      // 更新标题
      wx.setNavigationBarTitle({ title: '修改报修信息' })
      this.getRepairDetail(id)
    }
  },
  async getHouseList() {
    // 请求数据接口
    const { code, data: houseList } = await wx.http.get('/house')
    // 检测接口返回的结果
    if (code !== 10000) return wx.utils.toast('获取房屋列表失败!')
    // 数据渲染
    this.setData({ houseList })
  },
  async getRepairItem() {
    // 请求数据接口
    const { code, data: repairItem } = await wx.http.get('/repairItem')
    // 检测接口返回的数据
    if (code !== 10000) return wx.utils.toast('获取维修项目失败!')
    // 数据渲染
    this.setData({ repairItem })
  },
  afterRead(ev) {
    // console.log(ev.detail.file)
    // 临时文件
    const { file } = ev.detail
    // 调用接口上传至服务器
    wx.uploadFile({
      url: wx.http.baseURL + '/upload',
      filePath: file.url,
      name: 'file',
      header: {
        Authorization: getApp().token,
      },
      success: (res) => {
        // 转换 json 数据
        const data = JSON.parse(res.data)
        // 上传完成需要更新
        const { attachment = [] } = this.data
        attachment.push({ ...data.data })
        // 渲染数据
        this.setData({ attachment })
      },
    })
  },
  async getRepairDetail(id) {
    console.log(id);
    if (!id) return
    // 请求数据接口
    const { code, data: repairDetail } = await wx.http.get('/repair/' + id)
    // 检测接口调用结果
    if (code !== 10000) return wx.utils.toast('获取报修信息失败!')
    // 渲染报修信息
    this.setData({ ...repairDetail })
  },
  selectDate(ev) {
    this.setData({
      dateLayerVisible: false,
      appointment: wx.utils.formatDate(ev.detail),
    })
  },
  selectHouse(ev) {
    const { id: houseId, name: houseInfo } = ev.detail
    this.setData({ houseId, houseInfo })
  },
  selectRepairItem(ev) {
    // 获取用户选择的维修项目名称
    const { id: repairItemId, name: repairItemName } = ev.detail
    // 页面中渲染
    this.setData({ repairItemId, repairItemName })
  },
  openHouseLayer() {
    this.setData({ houseLayerVisible: true })
  },
  closeHouseLayer() {
    this.setData({ houseLayerVisible: false })
  },
  openRepairLayer() {
    this.setData({ repairLayerVisible: true })
  },
  closeRepairLayer() {
    this.setData({
      repairLayerVisible: false,
    })
  },

  openDateLayer() {
    this.setData({ dateLayerVisible: true })
  },
  closeDateLayer() {
    this.setData({ dateLayerVisible: false })
  },
  goList() {
    wx.reLaunch({
      url: '/repair_pkg/pages/list/index',
    })
  },
  async submitForm() {
    // 逐个验证表单数据
    if (!this.verifyHouse()) return
    if (!this.verifyRepair()) return
    if (!this.verifyMobile()) return
    if (!this.verifyDate()) return
    if (!this.verifyDescription()) return
    // 解构获取接口需要的参数
    const { id, houseId, repairItemId, appointment, mobile, description, attachment } = this.data    // 请求数据接口
    const { code } = await wx.http.post('/repair', {
      id,
      houseId,
      repairItemId,
      appointment,
      mobile,
      description,
      attachment
    })
    // 检测接口请求的结果
    if (code !== 10000) return wx.showToast({ title: '在线报修失败!', icon: 'none' })
    // 跳转到表单列表页面
    wx.redirectTo({
      url: '/repair_pkg/pages/list/index',
    })
  },
  verifyHouse() {
    const valid = this.data.houseId !== ''
    // 验证结果提示
    if (!valid) wx.utils.toast('请选择房屋信息!')
    // 返回验证结果
    return valid
  },
  verifyRepair() {
    const valid = this.data.repairItemId !== ''
    // 验证结果提示
    if (!valid) wx.utils.toast('请选择维修项目!')
    // 返回验证结果
    return valid
  },
  verifyMobile() {
    // 验证手机号
    const reg = /^[1][3-8][0-9]{9}$/
    const valid = reg.test(this.data.mobile.trim())
    // 验证结果提示
    if (!valid) wx.utils.toast('请填写正确的手机号码!')
    // 返回验证结果
    return valid
  },
  verifyDate() {
    // 验证日期格式
    const reg = /^\d{4}\/\d{2}\/\d{2}$/
    const valid = reg.test(this.data.appointment)
    // 验证结果提示
    if (!valid) wx.utils.toast('请选择预约日期!')
    // 返回验证结果
    return valid
  },
  verifyDescription() {
    // 验证报修项目描述
    const valid = this.data.description.trim() !== ''
    // 验证结果提示
    if (!valid) wx.utils.toast('请填写问题描述!')
    // 返回验证结果
    return valid
  },
})
