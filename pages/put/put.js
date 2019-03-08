// pages/put/put.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    last: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
  },
  init(page=1){
    var that = this;
    util.getJSON({
      apiUrl: apiurl.bagOrderIndex + "?page=" + page
    }, function (res) {
      var result = res.data.result;
      var list = result.list
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
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    util.getJSON({ apiUrl: apiurl.news + "?page=" + page }, function (res) {
      var result = res.data.result
      console.log(result)
      that.setData({
        news: result.list,
        page: result.page,
        last: false
      })
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
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
      that.init(Number(that.data.page.current_page) + 1)
    } else {
      that.setData({
        last: true
      })
      wx.hideLoading()
    }
    
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