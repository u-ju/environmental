// pages/pay/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
var link = require('../../utils/link.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payment_usable: [
      { image: "../../images/gold.png", text: '余额支付', checked: 'true' },
      { image: "../../images/weixin@2x.png", text: '环保金支付', checked: '' }
    ],
    payment: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var that = this;
    var data = { pay_source: options.pay_source }
    if (options.order_id){
      data["order_id"] = options.order_id
    }
    util.postJSON({ apiUrl: apiurl.create, data: data },
      function (res) {
        var result = res.data.result
        console.log(res)
        var payment_usable = that.data.payment_usable
        for (var key in result.payment_usable) {
          payment_usable[key]["text"] = result.payment_usable[key]["name"]
          payment_usable[key]["key"] = result.payment_usable[key]["key"]
        }
        that.setData({
          result: result,
          payment_usable: payment_usable,
          visible2: true,
          payment: payment_usable[0]["key"]
        })
      })
  },
  pays() {
    var that = this;
    that.setData({
      visible2: false,
    })
    wx.showLoading({
      title: '加载中',
    })
    util.postJSON({ apiUrl: apiurl.vendor, data: { pay_key: that.data.result.pay_key, payment: that.data.payment, pay_amount: that.data.result.pay_amount, pay_cash: that.data.result.pay_amount } },
      function (res) {
        var result = res.data.result
        console.log(res)
        if (result.payment == "balance") {
          util.postJSON({ apiUrl: apiurl.query, data: { pay_key: result.pay_key } }, function (res2) {
            util.alert("支付成功")
            that.init()
          }, function () {
            that.init()
          }, function () {
            that.init()
          })
        } else {
        wx.requestPayment({
          timeStamp: result.pay_info.timeStamp,
          nonceStr: result.pay_info.nonceStr,
          package: result.pay_info.package,
          signType: result.pay_info.signType,
          paySign: result.pay_info.paySign,
          success(res1) {
            console.log(res1)
            wx.hideLoading()
            util.postJSON({ apiUrl: apiurl.query, data: { pay_key: result.pay_key } }, function (res2) {
              wx.navigateTo({
                url: '../success/success',
              })
            }, function () {
              wx.navigateTo({
                url: '../error/error',
              })
            }, function () {
              wx.navigateTo({
                url: '../error/error',
              })
            })
          },
          fail(res) {
            util.alert("支付失败")
          }
        })
        }
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
  radioChange: function (e) {//入驻类型选择
    this.setData({
      payment: e.detail.value
    })
    console.log('radio发生change事件，携带value值为：', e.detail.value)
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