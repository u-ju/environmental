// pages/sorting_order/sorting_order.js
// pages/sorting_all/sorting_all.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: 0,
    windowHeight: 0,
    pay: false,
    order_no: '',
    tab: [],
    bag_order_arr: [],
    bag_stat: [],
    order_amount:[],
    details:[],
    order_no:[],
    order_id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        that.setData({
          windowWidth: res.windowHeight,
          windowHeight: res.windowWidth,
        })
      }
    })
    util.getJSON({ apiUrl: apiurl.config }, function (res) {
      var result = res.data.result;
      that.setData({
        tab: result.garbage_cate
      })
    })
    that.init(options.order_id)
  },
  init(bag) {
    var that = this;
    util.getJSON({
      apiUrl: apiurl.stationOrderShow + '?order_id=' + bag
    }, function (res) {
      var result = res.data.result;
      var details = result.details
      for (var i in details) {
        details[i]["xiala"] = false
        details[i]["ids"] = i
      }
      that.setData({
        bag_order_arr: result.bag_order_arr,
        bag_stat: result.bag_stat,
        order_amount: result.order_amount,
        order_no: result.order_no,
        details: result.details,
        order_id: result.order_id
      })
      wx.hideLoading()
    })
  },
  xiala(e) {
    console.log(e)
    this.setData({
      ['details[' + e.currentTarget.dataset.index + '].xiala']: !this.data.details[e.currentTarget.dataset.index].xiala
    })
  },
  select(e) {
    this.setData({
      ['details[' + e.currentTarget.dataset.ids + '].garbage_cate_id']: e.currentTarget.dataset.id,
      ['details[' + e.currentTarget.dataset.ids + '].garbage_cate_name']: e.currentTarget.dataset.name,
      ['details[' + e.currentTarget.dataset.ids + '].price']: e.currentTarget.dataset.price,
      ['details[' + e.currentTarget.dataset.ids + '].xiala']: false,
    })
  },
  input(e) {
    this.setData({
      ['details[' + e.currentTarget.dataset.index + '].price']: e.detail.value,
    })
  },
  pay_true() {
    var data = {
      order_id: this.data.order_id
    }, that = this;
    for (var key in this.data.details) {
      data['detail[' + key + '][garbage_cate_id]'] = this.data.details[key].garbage_cate_id;
      data['detail[' + key + '][price]'] = this.data.details[key].price
    }
    util.postJSON({ apiUrl: apiurl.stationOrderUpdate, data: data }, function (res) {
      var result = res.data.result
      util.alert(res.data.message)
      util.deplay_navigateTo("../edcs/edcs?currentData=0")
    })

  },
  pay() {

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