// pages/agriculturalLook/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:1
  },
  show(e){
    var active =  this.data.active
    active[e.currentTarget.dataset.index] = !active[e.currentTarget.dataset.index]
    this.setData({
      active: active
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      shop_id:21
    })
    this.init()
  },
  init(page=1) {
    var that = this;
    util.getJSON({ apiUrl: apiurl.shop_goodsIndexOwn + that.data.shop_id+"&page="+page }, function (res) {
      var result = res.data.result, active=[]
      for (var i in result.list){
        active[i]=1
      }
      that.setData({
        list: result.list,
        page: result.page,
        active: active
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
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    util.getJSON({ apiUrl: apiurl.shop_goodsIndexOwn + that.data.shop_id + "&page=1" }, function (res) {
      var result = res.data.result,active=[]
      var list = result.list
      if (page != 1) {
        list = that.data.news.concat(list)
      }
      for(var i in list){
        active[i]=1
      }
      that.setData({
        list: list,
        page: result.page,
        last: false,
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