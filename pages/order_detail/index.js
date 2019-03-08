// pages/order_detail/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      
      { key: '1', name: '分期付款', intr: '￥206.51 X 2期', choose: 0 },
      { key: '2', name: '环保金支付', choose: 0 },
      { key: '3', name: '微信支付', choose: 0 },
      
    ],
    visible3:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  open3() {
    this.setData({
      visible3: true,
    })
  },
  close3() {
    this.setData({
      visible3: false,
    })
  },
  onClose3() {
    this.onClose('visible3')
  },
  choose(e) {
    var list = this.data.items
    for (let i in list) {
      list[i].choosed = 0
    }
    list[e.currentTarget.dataset.id]["choosed"] = 1
    this.setData({
      items: list
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