// pages/payShop/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
var link = require('../../utils/link.js');
const isTel = (value) => !/^1[34578]\d{9}$/.test(value)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopdetail:[],
    value:'',
    bagkey:'',
    pay: [
      { image: "../../images/gold.png", text: '余额支付', checked: 'true' },
      { image: "../../images/weixin@2x.png", text: '环保金支付', checked: '' }
    ],
    casArray: [],
    result: {},
    payment: '',
    visible2:false,
    chooseimage:'../../images/y@2x.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // options["shop_id"]=8
    util.getJSON({ apiUrl: apiurl.gatherPayCreate + options.shop_id},
      function (res) {
        that.setData({
          shopdetail: res.data.result,
          shop_id: options.shop_id
        })
      })
    
      var eco_bag_type= [
        {
          "key": "big",
          "name": "大环保袋",
          "integral": "30"
        },
        {
          "key": "small",
          "name": "小环保袋",
          "integral": "20"
        }
      ]
    for (var i in eco_bag_type){
      eco_bag_type[i]["image"]='../../images/yw@2x.png'
    }
      // app.globalData.config.eco_bag_type
    this.setData({
      eco_bag_type: eco_bag_type
    })
    
  },
  back(){
wx.redirectTo({
  url: '../index/index',
})
  },
  bag(e){
    console.log(e)
    var key = e.currentTarget.dataset.key
    if (this.data.bagkey == e.currentTarget.dataset.key){
      key=''
    }
    this.setData({
      bagkey: key
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
  onChange(e) {
    console.log(e)
    this.setData({
      error: isTel(e.detail.value),
      value: e.detail.value,
    })
  },
  open2() {
    if (this.data.value==""){
      return util.alert("请输入转账金额")
    }
    var that = this;
    util.postJSON({ apiUrl: apiurl.create, data: { pay_source: 'shop_gather', shop_id: that.data.shop_id, amount: that.data.value, bag_type: that.data.bagkey } },
      function (res) {
        var result = res.data.result
        console.log(res)
        var payment_usable = that.data.pay
        for (var key in result.payment_usable) {
          payment_usable[key]["text"] = result.payment_usable[key]["name"]
          payment_usable[key]["key"] = result.payment_usable[key]["key"]
        }
        that.setData({
          result: result,
          pay: payment_usable,
          visible2: true,
          payment: payment_usable[0]["key"]
        })
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
    // this.setData({
    //   visible2: false,
    // })
  },
  onClose(key) {
    console.log('onClose')
    this.setData({
      [key]: false,
    })
  },
  onClose2() {
    this.onClose('visible2')
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