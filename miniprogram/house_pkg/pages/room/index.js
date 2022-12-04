// house_pkg/pages/room/index.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onLoad({ point, building }) {
    this.fake(point, building)
  },
  fake(point, building) {
    const size = Math.floor(Math.random() * 5) + 4
    const rooms = []
    for (let i = 0; i < size; i++) {
      const floor = Math.floor(Math.random() * 20) + 1
      const No = Math.floor(Math.random() * 3) + 1
      const room = [floor, 0, No].join('')
      if (rooms.includes(room)) continue
      rooms.push(room)
    }
    this.setData({ rooms, point, building })
  },
  goForm(ev) {
    const { point, building } = this.data
    wx.navigateTo({
      url: `/house_pkg/pages/form/index?point=${point}&building=${building}&room=${ev.mark.room}`,
    });

  }

})