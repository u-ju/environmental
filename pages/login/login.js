// pages/login/login.js
var interval = null //倒计时函数
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({
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
    source: "login"
  },
  getCode: function (options) {
    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function () {
      currentTime--;
      // console.log(currentTime)
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
      console.log(this.data.time)
      if (this.data.time !='获取验证码'){
        clearInterval(interval)
        this.setData({
          time: '重新获取',
          currentTime: 61
        })
      }
    }
    this.setData({
      phone: e.detail.value,
      disabled: sure,
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
  },

  newphone() {
    var that = this;
    util.postJSON({ apiUrl: apiurl.mobileLogin, data: { mobile_code: that.data.code, mobile: that.data.phone } }, function (res) {
      console.log(res)
      wx.setStorageSync("token", res.data.result.token)
      wx.reLaunch({
        url: '../personal_center/personal_center',
      })
    })


  },
  onLoad(e) {
    var title = '登录', that = this;
    this.setData({
      logo:app.globalData.config.logo
    })
    wx.setNavigationBarTitle({
      title: title
    })
    util.hideLoading()
  },
  index(){
    wx.navigateTo({
      url: 'index',
    })
  }
})
// 18583750250