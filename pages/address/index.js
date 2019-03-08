// pages/address/index.js
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
      that.init()
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
  detail(e){
    console.log(e)
    wx.navigateTo({
      url: '../address_edit/index?item=' + JSON.stringify(e.currentTarget.dataset.item),
    })
  },
  delete(e){
    console.log(e.currentTarget.dataset.id)
    var data=[],that = this;
    wx.showModal({
      title: '提醒',
      content: '是否确定删除地址？',
      cancelText: '否',
      cancelColor: '#2EB354',
      confirmText: '是',
      confirmColor: '#444444',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          data["address_id[0]"] = e.currentTarget.dataset.id
          util.postJSON({ apiUrl: apiurl.shippingAddress_destroy, data: data }, function (res) {
            util.alert(res.data.message)
            that.init()
          })
        } else {
          console.log('用户点击取消')
        }

      }
    })
    
  }
})