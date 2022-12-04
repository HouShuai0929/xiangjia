Page({
  onShow() {
    // 获取报修列表
    this.getRepairList()
  },
  async getRepairList() {
    // 请求数据接口
    const { code, data: { rows: repairList } } = await wx.http.get('/repair', { current: 1, pageSize: 10 })
    // 检测接口调用的结果
    if (code !== 10000) return wx.utils.toast('获取报修列表失败!')
    // 渲染报修列表
    this.setData({
      repairList,
      isEnpty: repairList.length === 0
    })
  },
  goDetail(ev) {
    wx.navigateTo({
      url: '/repair_pkg/pages/detail/index?id=' + ev.currentTarget.dataset.bid,
    })
  },
  addRepair() {
    wx.navigateTo({
      url: '/repair_pkg/pages/form/index',
    })
  },
})
