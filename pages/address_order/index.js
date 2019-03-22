// pages/address_order/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [

    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
  },
  choose(e) {
    var list = this.data.list
    var that = this;
    console.log()
    util.postJSON({ apiUrl: apiurl.shippingAddress_update, data: { address_id: e.currentTarget.dataset.id, default: 1 } }, function (res) {
      util.alert(res.data.message)
      wx.navigateBack()
    })
  },
  init() {
    var that = this;
    util.getJSON({ apiUrl: apiurl.shippingAddress_index }, function (res) {
      var result = res.data.result

      that.setData({
        list: result.list,
      })
      util.hideLoading()
    })
  },
  detail(e) {
    console.log(e)
    wx.navigateTo({
      url: '../address_edit/index?item=' + JSON.stringify(e.currentTarget.dataset.item),
    })
  },
})