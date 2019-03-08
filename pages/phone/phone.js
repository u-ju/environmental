// pages/phone/phone.js
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
    sure:true,
    phone:"",
    disabled:true,
    mobile_code: '',
    mobile: '',
    type:0,
    result:"",
    privacy_policy:'',
    choosed:0
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
    util.postJSON({ apiUrl: apiurl.captcha, data: { mobile: that.data.phone, source: "realname" } }, function (res) {
      var result = res.data.result
      util.alert(res.data.message)
      // that.setData({
      //   mobile_code: result.mobile_code,
      //   mobile: result.mobile
      // })
    })
  },
  phone(e){
    // var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    var phone = this.data.phone,sure = true
    if (e.detail.value.length == 11){
      sure = false
    }
    this.setData({
      phone: e.detail.value,
      disabled:sure
    })
  },
  code(e){
    var phone = this.data.phone, sure = true
    if (e.detail.value.length == 6) {
      sure = false
    }
    this.setData({
      code: e.detail.value,
      sure: sure
    })
  },
  newphone(){
    var that = this;
    if (that.data.type==1){
      if(that.data.choosed != 1){
        return util.alert('请勾选用户协议')
      }
      util.postJSON({ apiUrl: apiurl.realname_verify, data: { step: 1, mobile_code: that.data.code, mobile: that.data.phone}}, function (res) {
        wx.navigateTo({
          url: '../realname_authentication/realname_authentication',
        })
      })
      
    }else{
      wx.navigateTo({
        url: '../phone_new/phone_new?mobile_code=' + that.data.mobile_code + "&mobile=" + that.data.mobile,
      })
    }
    
  },
  onLoad(e){
    var title = '修改手机号',that = this;
    
    if(e.type==1){
      title = '实名认证'
      that.setData({
        type: 1
      })
      // util.getJSON({ apiUrl: apiurl.realname }, function (res) {
      //   var result = res.data.result
      //   that.setData({
      //     result: result
      //   })
      //   util.hideLoading()
      // })
    }
    this.setData({
      privacy_policy: app.globalData.config.about
      })
    wx.setNavigationBarTitle({
      title: title
    })
    wx.hideLoading()
  },
  choose(){
    this.setData({
      choosed: !this.data.choosed
    })
  }
})
