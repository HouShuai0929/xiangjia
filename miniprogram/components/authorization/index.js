// components/authorization/index.js
Component({
  data: {
    isLogin: false
  },
  lifetimes: {
    attached() {
      const isLogin = !!getApp().token
      this.setData({ isLogin })
      if (!isLogin) {
        const pageStack = getCurrentPages()
        const currentPage = pageStack[pageStack.length - 1]
        const redirectURL = currentPage.route
        wx.redirectTo({
          url: `/pages/login/index?redirectURL=/${redirectURL}`
        })
      }
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
