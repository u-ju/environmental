// pages/agentPay/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 地址
    current: 0,
    province: [],
    city: [],
    region: [],
    town: [],
    provinceObjects: [],
    cityObjects: [],
    regionObjects: [],
    townObjects: [],
    areaSelectedStr: '',
    area_id: '',
    maskVisual: 'hidden',
    provinceName: '请选择',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  // 支付
  open2() {
    var that = this;
    if (!that.data.area_id){
      return util.alert("请选择区域")
    }
    util.postJSON({ apiUrl: apiurl.create, data: { pay_source: "agent", area_id: that.data.area_id } },
      function (res) {
        var result = res.data.result
        console.log(res)

        for (let i in result.payment_usable) {
          result.payment_usable[i].choosed = 0
        }
        result.payment_usable[0].choosed = 1
        that.setData({
          result: result,
          payment_usable: result.payment_usable,
          pay_amount: result.pay_amount,
          visible2: true,
          payment: result.payment_usable[0]["key"]
        })
      })

  },
  choose(e) {
    var result = this.data.result;
    for (let i in result.payment_usable) {
      result.payment_usable[i].choosed = 0
      if (result.payment_usable[i].options && this.data.payment_ext) {
        for (let a in result.payment_usable[i].options) {
          result.payment_usable[i].options[a].choosed = 0
        }
      }
    }
    var payment_ext = '';
    result["payment_usable"][e.currentTarget.dataset.index]["choosed"] = 1
    var pay_amount = result.pay_amount
    this.setData({
      result: result,
      fq: e.currentTarget.dataset.index,
      payment_ext: payment_ext,
      pay_amount: pay_amount,
      payment: result["payment_usable"][e.currentTarget.dataset.index]["key"]
    })
  },
  onClose2(){
    var that = this;
    that.setData({
      visible2: false,
    })
  },
  close2() {
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
            wx.showLoading({
              title: '加载中',
              mask:true
            })
            util.navigateBack(1)
          }, function () {
            wx.navigateTo({
              url: '../error/error',
            })
          }, function () {
            wx.navigateTo({
              url: '../error/error',
            })
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
                wx.showLoading({
                  title: '加载中',
                })
                util.alert("支付成功")
                util.navigateBack(1)
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
  choosearea(e) {
    console.log(e)
    this.setData({
      areaSelectedStr: e.detail.areaSelectedStr,
      area_id: e.detail.area_id_val
    })
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

  }
})