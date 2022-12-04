// map.js
Page({
  data: {
    latitude: 40.060539,
    longitude: 116.343847,
    dialogVisible: false,
  
  },
   // ...
   onLoad({ id }) {
    // 获取维修详情
    this.getRepairDetail(id)
  },
  async getRepairDetail(id) {
    // id 不存在就不必发请求了
    if (!id) return
    // 请求数据接口
    const { code, data: repairDetail } = await wx.http.get('/repair/' + id)
    // 校验接口调用结果
    if (code !== 10000) return wx.utils.toast('获取报修详情失败!')
    // 渲染报修详情
    this.setData({ ...repairDetail })
  },
  openDialogLayer(){
    this.setData({ dialogVisible: true })
  },
  dialogClose(ev) {
    // 选择了确认后取消报修
    if (ev.detail === 'confirm') this.cancelRepair()
  },
  async cancelRepair() {
    // 请求数据接口
    const { code } = await wx.http.put('/cancel/repaire/' + this.data.id)
    // 检测接口的调用结果
    if (code !== 10000) return wx.utils.toast('取消报修失败!')
    // 跳转到报修列表页面
    wx.navigateBack()
  },
  editRepair(){
    wx.navigateTo({
      // repair_id 是全局变量，在前面已经定义
      url: '/repair_pkg/pages/form/index?id=' + this.data.id,
    })
  }
  
})
