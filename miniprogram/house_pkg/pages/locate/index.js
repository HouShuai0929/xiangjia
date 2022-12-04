// house_pkg/pages/locate/index.ts
import qqMap from '../../../utils/qqmap'
Page({
  /**
   * 页面的初始数据
   */
  data: {
  },
  onLoad() {
    this.getLocation()
  },
  async getLocation() {
    const { latitude, longitude } = await wx.getLocation()
    this.getPoint(latitude, longitude)
  },
  async chooseLocation() {
    // 用户所在位置经纬度
    const { latitude, longitude } = await wx.chooseLocation()
    // 查看经纬度
    this.getPoint(latitude, longitude)
  },
  getPoint(latitude, longitude) {
    wx.showLoading({ title: '正在加载...', mask: true })
    qqMap.reverseGeocoder({
      location: [latitude, longitude].join(','),
      success: ({ result: { address } }) => {
        // 结果为当前所在的地址
        this.setData({ address })
      },
    }),
      qqMap.search({
        keyword: '住宅小区',
        location: [latitude, longitude].join(','),
        page_size: 5,
        success: (res) => {
          const points = []
          res.data.forEach(({ id, title, _distance }) => {
            points.push({ id, title, _distance })
          })
          this.setData({ points })
        },
        fail() {
          wx.utils.toast('附近没有小区')
        },
        complete: () => {
          // 隐藏加载状态
          wx.hideLoading()
        },
      })
  },
  goBuilding(ev) {
    wx.navigateTo({
      url: '/house_pkg/pages/building/index?point=' + ev.mark.point,
    });

  }
})