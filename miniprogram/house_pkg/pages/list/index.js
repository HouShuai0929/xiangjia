
let house_id = 0
let house_index = 0
Page({
  data: {
    dialogVisible: false,
  },
  onShow() {
    this.getHouseList()
  },
  async getHouseList() {
    const { code, data: houseList } = await wx.http.get('/room')
    if (code !== 10000) return wx.utils.toast()
    this.setData({
      houseList,
      isEmpty: houseList.length === 0 ? true : false
    })
  },
  swipeClose(ev) {
    const { position, instance } = ev.detail
    if (position === 'right') {
      // 显示 Dialog 对话框
      this.setData({
        dialogVisible: true,
      })
      // 待删除的房屋id和索引
      house_id = ev.mark.id
      house_index = ev.mark.index
      // swiper-cell 滑块关闭
      instance.close()
    }
  },
  async deleteHouse() {
    // 请求数据接口
    const { code } = await wx.http.delete('/room/' + house_id)
    // 检测接口调用结果
    if (code !== 10000) return wx.utils.toast('删除房屋失败!')

    // 更新房屋列表
    this.data.houseList.splice(house_index, 1)
    this.setData({
      houseList: this.data.houseList,
      isEmpty: this.data.houseList.length === 0
    })
  },
  dialogClose(ev) {
    // 选择了确认后删除房屋
    // console.log(ev);
    ev.detail === 'confirm' && this.deleteHouse()
  },
  goDetail(ev) {
    wx.navigateTo({
      url: '/house_pkg/pages/detail/index?id=' + ev.mark.id,
    })
  },

  addHouse() {
    wx.navigateTo({
      url: '/house_pkg/pages/locate/index',
    })
  },
})
