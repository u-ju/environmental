// pages/login/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  formSubmit(e){
    var arr = { username: "请输入账号", password: "请输入密码"}
    var data = e.detail.value
    for (var j in arr){
      for (var i in data){
        if (i == j && !data[i]){
          console.log(arr[j])
          return util.alert1(arr[j])
        }
      }
    }
    var that = this;
    util.postJSON({ apiUrl: apiurl.login, data: data }, function (res) {
      wx.setStorageSync("token", res.data.result.token)
      wx.reLaunch({
        url: '../personal_center/personal_center',
      })
    })
    console.log(e)
  },
  index() {
    wx.navigateBack()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      logo: app.globalData.config.logo
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