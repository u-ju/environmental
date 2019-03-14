// pages/agent/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visible2:false,
    visible1: false,
    visible3: false,
    payment_usable: [
      { image: "../../images/gold.png", text: '余额支付', checked: 'true' },
      { image: "../../images/weixin@2x.png", text: '环保金支付', checked: '' }
    ],
    value: 'hhh',
    fgColor: 'black',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    this.init()
  },
  init() {
    var that = this;
    util.getJSON({ apiUrl: apiurl.agent }, function (res) {
      var result= res.data.result
      that.setData({
        is_agent: result.is_agent,
        agent: result.agent
      })
      wx.hideLoading()
    })
  },
  radioChange: function (e) {//入驻类型选择
    this.setData({
      payment: e.detail.value
    })
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  open2() {
    var that = this;
    util.postJSON({ apiUrl: apiurl.create, data: { pay_source: "agent" } },
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
        if (result.payment =="balance"){
          util.postJSON({ apiUrl: apiurl.query, data: { pay_key: result.pay_key } }, function (res2) {
            util.alert("支付成功")
            that.init()
          }, function () {
            that.init()
          }, function () {
            that.init()
          })
        }else{
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
                that.init()
              }, function () {
                that.init()
              }, function () {
                that.init()

              })
            },
            fail(res) {
              util.alert("支付失败")
            }
          })
        }
        

      })
  },
  sharerSet() {
    this.setData({
      visible1: true,
    })
  },
  close1() {
    this.setData({
      visible1: false,
    })
  },
  onClose1() {
    // this.onClose('visible1')
    this.setData({
      visible1: false,
    })
  },
  open3(e) {
    console.log(e.currentTarget.dataset.invite)
    // if (e.currentTarget.dataset.invite==''){
    //   return false
    // }
    this.setData({
      visible3: true,
      value: e.currentTarget.dataset.invite
    })
    
  },
  
  close3() {
    this.setData({
      visible3: false,
    })
  },
  onClose3() {
    // this.onClose('visible1')
    this.setData({
      visible3: false,
    })
  },
  formSubmit: function (e) {
    var that = this;
    util.postJSON({ apiUrl: apiurl.agent_sharerSet, data: { agent_id: e.detail.value.agent_id, share_mobile: e.detail.value.share_mobile } },
      function (res) {
        var result = res.data.result
        console.log(result)
        that.init()
      })
  },
  previewImage() {
    // 在自定义组件下，当前组件实例的 this，以操作组件内 <canvas> 组件
    const that = this.selectComponent('#qrcode')
    console.log("huhu")
    wx.canvasToTempFilePath({
      canvasId: 'wux-qrcode',
      success: (res1) => {
        // wx.previewImage({
        //   urls: [res.tempFilePath]
        // })
        wx.showModal({
          title: '保存图片',
          content: '确定要保存二维码？',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {
              wx.saveImageToPhotosAlbum({
                filePath: res1.tempFilePath,
                success(res) {
                  util.alert("保存成功")
                }
              })
            }
          }, fail: function (res) {
            console.log(11111)
          }
        })
      }
    }, that)
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