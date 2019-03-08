// pages/home_orders/home_orders.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentData: 0,
    tab: [
      //  {
      //   "id": "1",
      //   "name": "等待上门"
      // },
      // {
      //   "id": "2",
      //   "name": "已完成"
      // },
    ],
    list: [],
    order_status: 1,
    last: false,
    bill:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    if (options.fill){
      that.setData({
        bill:true
      })
    }
    // util.getJSON({ apiUrl: apiurl.config }, function (res) {
      // var result = res.data.result
      // console.log(res)
      that.setData({
        tab: app.globalData.config.onsite_recycle_order_status
      })
    // })
    that.init()
  },
  init(order_status = this.data.tab[0].id, page = 1) {
    var that = this;
    var url = apiurl.onsiteRecycle_orderIndex;
    if(that.data.bill){
      url = apiurl.onsiteRecycle_orderRecycleIndex;
    }
    util.getJSON({ apiUrl: url, data: { order_status: order_status, page: page } }, function (res) {
      var result = res.data.result
      // console.log(result)
      var list = result.list
      if (page != 1) {
        list = that.data.news.concat(list)
      }
      that.setData({
        list: list,
        page: result.page,
        last: false
      })
      util.hideLoading()
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //获取当前滑块的index
  bindchange: function (e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })
  },
  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    const that = this;
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.target.dataset.current,
        order_status: e.target.dataset.order_status,
        news: ""
      })
      that.init(e.target.dataset.order_status)
    }
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
    util.getJSON({ apiUrl: apiurl.news, data: { order_status: that.data.order_status, page: 1 } }, function (res) {
      var result = res.data.result
      // console.log(result)
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
      that.init(that.data.order_status, Number(that.data.page.current_page) + 1)
    } else {
      that.setData({
        last: true
      })
      wx.hideLoading()
    }
    // util.getJSON({ apiUrl: apiurl.news }, function (res) {
    //   var result = res.data.result;
    //   var news = that.data.news;
    //   console.log(news)
    //   console.log(res)
    //   that.setData({
    //     news: news.concat(result.list)
    //   })

    //   wx.hideLoading()
    // })


  },
  detail(e) {
    // console.log(e.currentTarget.dataset.id)
    var url = '../order_details_bill/order_details_bill?order_id=' + e.currentTarget.dataset.id;
    if(this.data.bill){
      url = '../order_details/order_details?order_id=' + e.currentTarget.dataset.id
    }
    wx.navigateTo({
      url: url,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})