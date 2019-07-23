// pages/realname_suc/index.js
var interval = null 
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '请选择日期',
    fun_id: 2,
    time: '获取验证码', //倒计时 
    currentTime: 61,
    sure: true,
    phone: "",
    disabled: true,
    mobile_code: '',
    mobile: '',
    type: 0,
    result: "",
    about: '',
    choosed: 1,
    source: "realname",
    status:-3
  },

  /**
   * 生命周期函数--监听页面加载
   */
  nav(){
    wx.navigateTo({
      url: '../realname_authentication/realname_authentication',
    })
  },
  onLoad: function (options) {
    var that = this;
    // util.getJSON({ apiUrl: apiurl.realname }, function (res) {
    //   that.setData({
    //     result: res.data.result,
    //     status: res.data.result.status
    //   })
    // })
    that.setData({
      result: JSON.parse(options.result),
      status: JSON.parse(options.result).status
    })
    wx.hideLoading()
  },
  choose() {
    this.setData({
      choosed: !this.data.choosed
    })
  },
  getCode: function (options) {
    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: "重新获取(" + currentTime + ')'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新获取',
          currentTime: 61,
          disabled: false
        })
      }
    }, 1000)
  },
  getVerificationCode() {
    this.getCode();
    var that = this
    that.setData({
      disabled: true
    })
    util.postJSON({ apiUrl: apiurl.captcha, data: { mobile: that.data.phone, source: that.data.source } }, function (res) {
      var result = res.data.result
      util.alert(res.data.message)
    })
  },
  phone(e) {
    var phone = this.data.phone, sure = true
    if (e.detail.value.length == 11) {
      sure = false
      if (this.data.time != '获取验证码') {
        clearInterval(interval)
        this.setData({
          time: '重新获取',
          currentTime: 61
        })
      }
    }
    this.setData({
      phone: e.detail.value,
      disabled: sure
    })
  },
  code(e) {
    var phone = this.data.phone, sure = true
    if (e.detail.value.length == 6) {
      sure = false
    }
    this.setData({
      code: e.detail.value,
      sure: sure
    })
    console.log(e.detail.value)
  },
  newphone() {
    var that = this;

    if (that.data.choosed != 1) {
      return util.alert('请勾选用户协议')
    }
    util.postJSON({ apiUrl: apiurl.realname_verify, data: { step: 1, mobile_code: that.data.code, mobile: that.data.phone } }, function (res) {
      wx.navigateTo({
        url: '../realname_authentication/realname_authentication',
      })
    })



  },
})