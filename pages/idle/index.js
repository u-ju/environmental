// pages/idle/index.js
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
  onLoad: function (options) {
    this.setData({
      address: wx.getStorageSync('locAddresscity') || wx.getStorageSync('locAddress')
    })
    this.init()
  },
  init(page = 1) {
    var that = this;
    var data = {

      keywords: that.data.keywords || ''
    }
    util.getJSON({
      apiUrl: apiurl.idle.index + "?1=1",
      data: data
    }, function (res) {
      var result = res.data.result
      var list = result.list
      if (page != 1) {
        list = that.data.list.concat(list)
      }
      that.setData({
        list: list,
        page: result.page,
        hideHeader: true,
        hideBottom: true
      })
      wx.hideLoading()
    })
  },
  detail(e) {
    wx.navigateTo({
      url: 'detail/index?id=' + e.currentTarget.dataset.id,
    })
  },
  link() {
    wx.navigateTo({
      url: 'list/index',
    })
  },
  

  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    util.getJSON({ apiUrl: apiurl.idle.index + "?page=1"+ "&keywords=" + that.data.keywords }, function (res) {
      var result = res.data.result
      console.log(result)
      that.setData({
        list: result.list,
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
      that.init( Number(that.data.page.current_page) + 1)
    } else {
      that.setData({
        last: true
      })
      wx.hideLoading()
    }
  },
})