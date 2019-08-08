// pages/tenantsChoice/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    // var apply_info = JSON.parse(options.apply_info)
    // if (apply_info){
    //   this.setData({
    //     apply_info: apply_info,
    //     room_list: options.room_list
    //   })
    // }
    this.init()
  },
  init() {
    var that = this;
    var result = getApp().globalData.shop
    that.setData({
      is_apply: result.is_apply || "",
      apply_info: result.apply_info || "",
      online_list: result.shop_info.online_list || "",
      offline_list: result.shop_info.offline_list || "",
      room_list: result.apply_info.buttun_list || "",
      league_list: result.shop_info.league_list || "",
      share_mobile: result.apply_info.share_mobile || "",
      feature_list: result.apply_info.feature_list || ""
    })
  },
  offline(e){
    wx.navigateTo({
      url: '../tenants/tenants?room_list=' + this.data.room_list + "&feature_list=" + JSON.stringify(this.data.feature_list) + "&source=" + e.currentTarget.dataset.key + "&share_mobile=" + this.data.share_mobile,
    })
  },
  online(e){
    wx.navigateTo({
      url: '../tenants/online?source=' + e.currentTarget.dataset.key + "&share_mobile=" + this.data.share_mobile,
    })
  },
  league(e) {
    wx.navigateTo({
      url: '../tenants/league?source=' + e.currentTarget.dataset.key + "&share_mobile=" + this.data.share_mobile,
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