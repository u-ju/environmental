// pages/businessProduct/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,//显示面板指示点
    autoplay: true,//自动播放
    beforeColor: "white",//指示点颜色
    afterColor: "coral",//当前选中的指示点颜色
    interval: 5000,
    duration: 1000,
    banner: [
      'https://wyhb-res-pr.zgwyhb.com/uploads/image/2019/03/29/2394b94632b9a7a1e9aa0b397f5ce2c3.jpg',
      'https://wyhb-res-pr.zgwyhb.com/uploads/image/2019/03/29/2394b94632b9a7a1e9aa0b397f5ce2c3.jpg',
      'https://wyhb-res-pr.zgwyhb.com/uploads/image/2019/03/29/2394b94632b9a7a1e9aa0b397f5ce2c3.jpg'
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    util.getJSON({ apiUrl: apiurl.shopSettled_goodsShow + "?shop_id=" + that.data.shop_id + "&spu_id=" + that.data.spu_id }, function (res) {
      var result = res.data.result
      that.setData({
        result: result
      })
      wx.hideLoading()
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