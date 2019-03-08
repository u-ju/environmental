// pages/edcs_choose/edcs_choose.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
var link = require('../../utils/link.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    action:[],
    code:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.action){
      
      this.setData({
        action: JSON.parse(options.action),
        code: JSON.parse(options.code)
      })
    }
  },
  bag(e){
    this.postJSON({ apiUrl: apiurl.action, data: { action: e.currentTarget.dataset.key, code: this.data.code } }, function (res2) {
      var result2 = res2.data.result;
      if (result2.control){
        wx.navigateTo({
          url: link[result2.control],
        })
      }
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