// pages/address_order/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[
      { choosed: 1 },
      { choosed: 0 },
      { choosed: 0 },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  choose(e){
    var list  = this.data.list
    for(let i in list){
      list[i].choosed=0
    }
    list[e.currentTarget.dataset.id]["choosed"]=1
    this.setData({
      list:list
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