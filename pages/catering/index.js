// pages/catering/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { title: '火锅', choose: false },
      { title: '西餐', choose: false },
      { title: '烧烤', choose: false },
      { title: '海鲜', choose: false },
      { title: '素食', choose: false },
      { title: '粤菜', choose: false },
      { title: '川菜', choose: false },
      { title: '湘菜', choose: false },
      { title: '清真菜', choose: false },
      { title: '自助餐', choose: false },
      { title: '韩国料理', choose: false },
      { title: '日本料理', choose: false },
      { title: '小吃简餐', choose: false },
      { title: '面包甜点', choose: false },
      { title: '宴会预定', choose: false },
      { title: '外卖', choose: false },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  choose(e) {
    console.log(e.currentTarget.dataset.choose)
    var items = this.data.items
    items[e.currentTarget.dataset.index].choose = !e.currentTarget.dataset.choose
    this.setData({
      items: items
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})