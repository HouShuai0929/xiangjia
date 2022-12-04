// 消息提示
const utils = {
  toast(title = '数据加载失败') {
    wx.showToast({
      title,
      icon: 'none',
      mask: true
    });
  },
  /**
   * 格式化时间
   */
   formatDate(timestamp) {
    const date = new Date(timestamp)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    return [year, month, day].map(this.formatNumber).join('/')
  },
  formatNumber(n) {
    const s = n.toString()
    return s[1] ? s : '0' + s
  }
}
// 导出为微信全局对象
wx.utils = utils
// 导出为文件对象
export default utils