Page({
  onLoad() {
    // 获取访客列表
    this.getVistorList()
  },
  async getVistorList() {
    // 请求数据接口
    const { code, data: { rows: visitorList } } = await wx.http.get('/visitor')
    // 检测接口调用结果
    if (code !== 10000) return wx.utils.toast('获取访客列表失败!')
    // 渲染访客列表
    this.setData({ visitorList })
  },
  goPassport(ev) {
     
    wx.navigateTo({
      url: '/visitor_pkg/pages/passport/index?id=' + ev.mark.id,
    })
  },
})
