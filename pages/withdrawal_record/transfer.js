// pages/withdrawal_record/transfer.js
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
    this.setData({
      url: options.url
    })
    console.log(options.url)
    this.init()
  },
  init( page = 1) {
    var that = this;
    util.getJSON({
      apiUrl: apiurl[that.data.url] + "?page=" + page
    }, function (res) {
      var result = res.data.result
      var list = result.list;
      if (page != 1) {
        list = that.data.news.concat(list)
      }
      that.setData({
        list: list,
        page: result.page,
        last: false
      })
      wx.hideLoading()
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
    wx.showNavigationBarLoading();
    var that = this;
    util.getJSON({
      apiUrl: apiurl[that.data.url] + "?page=" + 1
    }, function (res) {
      var result = res.data.result
      var list = result.list;
      if (page != 1) {
        list = that.data.news.concat(list)
      }
      that.setData({
        list: list,
        page: result.page,
        last: false
      })
      wx.hideLoading()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    // 页数+1
    if (Number(that.data.page.current_page) != Number(that.data.page.last_page)) {
      that.init( Number(that.data.page.current_page) + 1)
    } else {
      that.setData({
        last: true
      })
      wx.hideLoading()
    }
  },
})