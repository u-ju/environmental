// pages/payment_details/index.js

const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result:{},
    list:[],
    page:{},
    visible1: false,
    visible2: false,
    items:[],
    payment:'',
    amount:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    
    if (options.id){
      this.setData({
        id: options.id
      })
      
    }
    
  },
  orderShow(){
    var that = this;
    util.getJSON({ apiUrl: apiurl.userNper_orderShow + that.data.id }, function (res) {
      that.setData({
        result: res.data.result
      })
    })
  },
  init(page = 1) {
    var that = this;
    var order_status = that.data.order_status;
    util.getJSON({ apiUrl: apiurl.userNper_repaymentIndex + that.data.id + "&page="+page}, function (res) {
      var result = res.data.result
      var list = result.list
      if (page != 1) {
        list = that.data.list.concat(list)
      }
      that.setData({
        list: list,
        page: result.page,
      })
      wx.hideLoading()
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.id != '' && this.data.id !=undefined){
      this.orderShow()
      this.init()
    }
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    
    util.getJSON({ apiUrl: apiurl.userNper_repaymentIndex + that.data.id+"&page=1"  }, function (res) {
      var result = res.data.result
      console.log(result)
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
      that.init(Number(that.data.page.current_page) + 1)
    } else {
      that.setData({
        last: true
      })
      wx.hideLoading()
    }
  },
  open1() {
    this.setData({
      visible1: true,
    })
  },
  open2() {
    this.setData({
      visible2: true,
    })
  },
  close1() {
    this.setData({
      visible1: false,
    })
  },
  close2() {
    this.setData({
      visible2: false,
    })
  },
  formSubmit(e){
    console.log(e.detail.value)
    var that = this;
    if (!e.detail.value.amount){
      return util.alert("请输入还款金额")
    }
    util.postJSON({ apiUrl: apiurl.create, data: { pay_source: 'nper_repayment', order_id: that.data.id, amount: e.detail.value.amount} },
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
          visible1: false,
          visible2: true,
          amount:''
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
    if (!that.data.payment){
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
})