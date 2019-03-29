// pages/my_integral/index.js



const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: ['饮料瓶   12个', '饮料瓶   12个', '饮料瓶   12个'],
    gold: true,
    isRuleTrue: false,
    list: [0],
    balance: "",
    integral: "",
    page: {},
    url: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.loading()
    var that = this
    var url = apiurl.integralIndex;
    var title = '我的积分'
    this.setData({
      gold: false,
    })
    that.setData({
      url: url
    })
    wx.setNavigationBarTitle({
      title: title,
    })
    util.getJSON({ apiUrl: apiurl.wallet }, function (res) {
      var result = res.data.result;
      that.setData({
        balance: result.balance,
        integral: result.integral,
        is_password: result.is_password
      })
    })
    that.init()
  },
  init(page = 1) {
    var that = this;
    util.getJSON({ apiUrl: that.data.url + '?page=' + page }, function (res) {
      var result = res.data.result
      var list = result.list
      if (page != 1) {
        list = that.data.list.concat(list)
      }
      that.setData({
        list: list,
        page: result.page
      })
      util.hideLoading()
    })
  },
  //打开规则提示
  showRule: function () {
    this.setData({
      isRuleTrue: true
    })
  },
  //关闭规则提示
  hideRule: function () {
    this.setData({
      isRuleTrue: false
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
    var that = this;
    wx.showNavigationBarLoading();
    util.getJSON({ apiUrl: that.data.url + '?page=' + 1 }, function (res) {
      var result = res.data.result
      var list = result.list
      that.setData({
        list: list,
        page: result.page
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})