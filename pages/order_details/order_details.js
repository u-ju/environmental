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
    disabled:false,
    visible2:false
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
      util.navigateBack()
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
  close2(){
    this.setData({
      visible2: false,
    })
  },
  open2(){
    var that = this
    util.postJSON({ apiUrl: apiurl.create, data: { pay_source: 'onsite_recycle', order_id: that.data.order_id, } },
      function (res) {
        var result = res.data.result
        for (let i in result.payment_usable) {
          result.payment_usable[i].choosed = 0
        }
        result.payment_usable[0].choosed = 1
        that.setData({
          items: result,
          pay_amount: result.pay_amount,
          payment: result["payment_usable"][0]["key"],
          visible2: true,
          amount: ''
        })
      })
  },
  choose(e) {
    var items = this.data.items;
    for (let i in items.payment_usable) {
      items.payment_usable[i].choosed = 0
    }
    items["payment_usable"][e.currentTarget.dataset.index]["choosed"] = 1
    this.setData({
      items: items,
      payment: e.currentTarget.dataset.key
    })
  },
  goodsBuy() {
    var that = this;
    if (!that.data.payment) {
      return util.alert("请选择支付方式")
    }
    that.setData({
      visible2: false,
    })
    wx.showLoading({
      title: '加载中',
    })
    var data = { pay_key: that.data.items.pay_key, payment: that.data.payment, pay_amount: that.data.items.pay_amount, pay_cash: that.data.items.pay_amount }
    console.log(data)
    util.postJSON({ apiUrl: apiurl.vendor, data: data },
      function (res) {
        var result = res.data.result
        console.log(res)
        if (result.payment == "balance") {
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
        } else if (result.payment == "wechat") {
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
  //图片点击事件
  imgYu: function (event) {
    
    var src = event.currentTarget.dataset.src;//获取data-src
    var imgList = event.currentTarget.dataset.list;//获取data-list
    console.log(src, imgList)
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
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
