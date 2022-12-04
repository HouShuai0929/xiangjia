// house_pkg/pages/building/index.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    point: '',
    size: 0,
    type: '',
  },
  onLoad({point}) {
    this.fake(point)
  },
  fake(point) {
    const size = Math.floor(Math.random() * 4) + 3
    const type = size > 4 ? '号楼' : '栋'
    this.setData({ point, size, type })
  },
  goRoom(ev){
    wx.navigateTo({
      url:  `/house_pkg/pages/room/index?point=${this.data.point}&building=${ev.mark.building}`,
    });
  }
})