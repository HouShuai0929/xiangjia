// import utils from "../../utils/utils"
Page({
  data: {},
  onLoad() {
    // 页面加载时拿到列表数据
    this.getNotifyList()
  },
  // 拿到列表数据
  async getNotifyList() {
    const { code, data: notifyList } = await wx.http({ url: '/announcement' })
    if (code !== 10000) return wx.utils.toast()
    this.setData({ notifyList })
  }
})