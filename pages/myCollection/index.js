// pages/myCollection/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visible1: false,
    list1: [],
    list: [0],
    current: 0
  },
  open1() {
    this.setData({
      visible1: true,
    })
  },
  close1() {
    this.setData({
      visible1: false,
    })
  },
  init(page=1) {
    this.setData({
      list: [0]
    })
    var that = this;
    var source = this.data.current == 0 ? 'shop' : 'goods'
    var that = this;
    util.getJSON({ apiUrl: apiurl.collectIndex + source+ "&page=" + page}, function (res) {
      var result = res.data.result
      var list = result.list
      if (page != 1) {
        list = that.data.list.concat(list)
      }
      that.setData({
        list: list,
        page: result.page,
        last: false,
      })
    })
  },
  
  tabcur(e) {
    var that = this;
    if (this.data.current == e.currentTarget.dataset.cur) {
      return
    }
    this.setData({
      current: e.currentTarget.dataset.cur
    }, function () {
      that.init()
    })
  },
  shopd(e){
    console.log(e)
    wx.navigateTo({
      url: '../business_details/business_details?id='+e.currentTarget.dataset.id,
    })
  },
  goodsd(e) {
    console.log(e)
    wx.navigateTo({
      url: '../installment_details/installment_details?id=' + e.currentTarget.dataset.sku_id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
    // this.init1()
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
    var source = this.data.current == 0 ? 'shop' : 'goods'
    util.getJSON({ apiUrl: apiurl.collectIndex + source+ "&page=" + 1 }, function (res) {
      var result = res.data.result
      var list = result.list
      that.setData({
        list: list,
        page: result.page,
        last: false,
      })
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
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
      that.init(Number(that.data.page.current_page) + 1)
    } else {
      that.setData({
        last: true
      })
      wx.hideLoading()
    }
  },
})