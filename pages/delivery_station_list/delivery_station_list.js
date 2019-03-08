// pages/delivery_station_list/delivery_station_list.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this;
    util.getJSON({ apiUrl: apiurl.arkIndex, data: { token: util.getToken() } }, function (res) {
      var result = res.data.result;
      var list = result.list
      for (var key in list) {
        list[key].distance = util.distance(app.globalData.latitude, app.globalData.longitude, list[key].latitude, list[key].longitude)
      }
      // console.log(list)
      that.setData({
        list: list
      })
      util.hideLoading()
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
  map(){
    wx.navigateTo({
      url: '../delivery_station/delivery_station',
    })
  },
  map_xx(e){
    // console.log(e);
    wx.navigateTo({
      url: '../delivery_station/delivery_station?data=' + JSON.stringify(e.currentTarget.dataset.data),
    })
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