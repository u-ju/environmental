// pages/order_details/order_details.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select: false,
    tihuoWay: '门店自提',
    casArray: [],
    casIndex: 0,
    disabled:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })

    util.getJSON({ apiUrl: apiurl.config }, function (res) {
      var result = res.data.result
      console.log(res)
      that.setData({
        casArray: result.onsite_recycle_order_type
      })
    })

    if (options.order_id) {
      util.getJSON({ apiUrl: apiurl.onsiteRecycle_orderRecycleShow + "?order_id=" + options.order_id }, function (res) {
        var result = res.data.result
        console.log(res)
        that.setData({
          list: result,
          order_id: options.order_id
      })
      wx.hideLoading()
      })
    }
  },
  formSubmit(e){
    console.log(e)
    var data = e.detail.value,that =this;
    data.order_id = this.data.order_id
    data.order_type = this.data.casArray[this.data.casIndex].id
    this.setData({
      disabled:true
    })
    util.postJSON({ apiUrl: apiurl.onsiteRecycle_orderEvaluate, data: data }, function (res) {
      var result = res.data.result
      util.alert(res.data.message)
      util.deplay_navigateTo('../place_order/place_order')
    }, function(){
      that.setData({
        disabled: true
      })
      }, function () {
        that.setData({
          disabled: true
        })
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
  // bindShowMsg() {
  //   this.setData({
  //     select: !this.data.select
  //   })
  // },
  // mySelect(e) {
  //   var name = e.currentTarget.dataset.name
  //   this.setData({
  //     tihuoWay: name,
  //     select: false
  //   })
  // },
  bindCasPickerChange: function (e) {
    
    // if (e.detail.value == 4) {
    //   this.setData({ reply: true })
    // } else {
    //   this.setData({ reply: false })
    // }
    this.setData({
      casIndex: e.detail.value
    })
    console.log('选的是', this.data.casArray[this.data.casIndex].id)
    console.log('选的是', this.data.casArray[this.data.casIndex].name)
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
