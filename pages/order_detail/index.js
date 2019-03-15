// pages/order_detail/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      
      { key: '1', name: '分期付款', intr: '￥206.51 X 2期', choose: 0 },
      { key: '2', name: '环保金支付', choose: 0 },
      { key: '3', name: '微信支付', choose: 0 },
      
    ],
    visible3:false,
    result:{},
    address:{},
    payment:'',
    payment_ext:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // if (options.spec_value){
    //   spec_value: 
    // }
    console.log(JSON.parse(options.result))
    var result = JSON.parse(options.result)
    this.setData({
      result: result
    })
    
    
  },
  address() {
    var that = this;
    util.getJSON({ apiUrl: apiurl.shippingAddress_index +"?default=1" }, function (res) {
      var result = res.data.result, address={}
      if (result.list.length>0){
        address=result.list[0]
      }
      that.setData({
        address: address,
      })
      util.hideLoading()
    })
  },
  open3() {
    var that = this;
    util.postJSON({ apiUrl: apiurl.create, data: { pay_source: 'order', order_key: that.data.result.order_key, address_id: that.data.address.address_id} },
      function (res) {
        var result = res.data.result
        for (let i in result.payment_usable) {
          result.payment_usable[i].choosed = 0
        }
        result.payment_usable[0].choosed = 1
        that.setData({
          items: result,
          visible3: true,
          pay_amount: result.pay_amount,
          payment: result["payment_usable"][0]["key"]
        })
      })
  },
  close3() {
    this.setData({
      visible3: false,
    })
  },
  onClose3() {
    this.setData({
      visible3: false,
    })
  },
  choose(e) {
    var items = this.data.items;
    for (let i in items.payment_usable) {
      items.payment_usable[i].choosed = 0
      if (items.payment_usable[i].options && this.data.payment_ext){
        for (let a in items.payment_usable[i].options) {
          items.payment_usable[i].options[a].choosed = 0
        }
      }
    }
    var payment_ext='';
    items["payment_usable"][e.currentTarget.dataset.index]["choosed"] = 1
    var pay_amount = items.pay_amount
    this.setData({
      items: items,
      fq: e.currentTarget.dataset.index,
      payment_ext: payment_ext,
      pay_amount: pay_amount,
      payment: items["payment_usable"][e.currentTarget.dataset.index]["key"]
    })
  },
  choosed(e){
    var that =this;
    var items = that.data.items, fq = that.data.fq;
    for (let i in items.payment_usable[fq].options) {
      items.payment_usable[fq].options[i].choosed = 0
    }
    items.payment_usable[fq].options[e.currentTarget.dataset.index]["choosed"] = 1
    var pay_amount = items.payment_usable[fq].options[e.currentTarget.dataset.index]["pay_amount"]
    this.setData({
      items: items,
      payment_ext: items.payment_usable[fq].options[e.currentTarget.dataset.index]["key"],
      pay_amount: pay_amount
    })
  },
  link(){
   var  url= '../address_order/index'
    if (Object.keys(this.data.address).length ==0){
      url = '../address/index'
    }
    wx.navigateTo({
      url: url
    })
  },
  goodsBuy(){
      var that = this;
      that.setData({
        visible3: false,
      })
      wx.showLoading({
        title: '加载中',
      })
    var data = { pay_key: that.data.items.pay_key, payment: that.data.payment, pay_amount: that.data.pay_amount, pay_cash: that.data.pay_amount, payment_ext: that.data.payment_ext }
    console.log(data)
    util.postJSON({ apiUrl: apiurl.vendor, data: data },
        function (res) {
          var result = res.data.result
          console.log(res)
          if (result.payment == "balance" || result.payment == "installment") {
            util.postJSON({ apiUrl: apiurl.query, data: { pay_key: result.pay_key } }, function (res2) {
              util.alert("支付成功")
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
          } else if (result.payment == "wechat"){
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
                  console.log("emmmmmmmmm")
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
      // this.setData({
      //   visible2: false,
      // })
  
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
    this.address()
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