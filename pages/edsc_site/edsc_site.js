// pages/edsc_site/edsc_site.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    station:[],
    pay:'',
    page:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that  = this;
    util.getJSON({ apiUrl: apiurl.config }, function (res) {
      var result = res.data.result;
      that.setData({
        bag: result.garbage_bag_order_status,
        station: result.garbage_station_order_status,
        pay: result.garbage_station_order_status[0].name,
        casArray: result.onsite_recycle_order_type
      })
    })
    that.init()
  },
  init(order_status = 0, page = 1) {
    var that = this;
    util.getJSON({
      apiUrl: apiurl.bagOrderSorterIndex + '?order_status=' + order_status+"&page="+page
    }, function (res) {
      var result = res.data.result;
      console.log(order_status)
      that.setData({
        list: result.list,
        page: result.page
      })
      wx.hideLoading()
    })
  },
  xiala() {
    this.setData({
      xiala: !this.data.xiala
    })
  },
  select(e) {
    this.setData({
      pay: e.currentTarget.dataset.name,
      pay_val: e.currentTarget.dataset.id,
      xiala: !this.data.xiala
    })
    this.init(e.currentTarget.dataset.id, 1)
  },
  order(e) {
    console.log(e.currentTarget.dataset.order_id)
    wx.navigateTo({
      url: '../sorting_order/sorting_order?order_id=' + e.currentTarget.dataset.order_id,
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
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    util.getJSON({ apiUrl: apiurl.bagOrderSorterIndex + '?order_status=' + that.data.pay_val + "&page=1"  }, function (res) {
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
      that.init(that.data.pay_val, Number(that.data.page.current_page) + 1)
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