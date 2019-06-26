// pages/recruitment/recruit/mypositionDetails/index.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    visiblet: false,
    visibler: true,
    item: ['初中及以下', '高中','大专']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var money1 = [], money2 = []
    for (var i = 0; i < 24; i++) {
      money1.push(i + "K")
      money2.push(i + "K")
    }
    this.setData({
      money1: money1,
      money2: money2,
    })
  },
  bindChange(e){
    console.log(e)
  },
  open() {
    this.setData({
      ['visible' + e.target.dataset.name]: true
    })
  },
  colse(e){
    this.setData({
      ['visible' + e.target.dataset.name]: false
    })
  },
  ch_del() {
    this.setData({
      visiblet: false
    })
  },
  ch_true() {
    this.setData({
      visiblet: false
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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