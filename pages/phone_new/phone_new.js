// pages/phone_new/phone_new.js
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
    mobile_code_old: '',
    mobile_old: '',
    bangding:true
  },
  onLoad:function(e){
    if(e.mobile){
      this.setData({
        mobile_code_old: e.mobile_code,
        mobile_old: e.mobile,
        bangding: false
      })
    }
    wx.hideLoading()
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
    
    util.postJSON({ apiUrl: apiurl.captcha, data: { mobile: that.data.phone, source: "update" } }, function (res) {
      var result = res.data.result
      util.alert(res.data.message)
      // that.setData({
      //   mobile_code: result.mobile_code,
      //   mobile: result.mobile
      // })
    })
  },
  phone(e) {
    // var myreg = /^1[3|4|5|7|8][0-9]{9}$/;
    var phone = this.data.phone, sure = true
    
    if (e.detail.value.length == 11) {
      sure = false
    }
    this.setData({
      phone: e.detail.value,
      disabled: sure
    })
  },
  code(e) {
    var phone = this.data.phone, sure = true
    if (e.detail.value.length == 6 ) {
      sure = false
    } 
    // else if (e.detail.value.length == 6) {
    //   util.alert("验证码错误")
    // }
    this.setData({
      code: e.detail.value,
      sure: sure
    })
  },
  newphone(e) {
    console.log(e)
    var data ={},that = this
    if (this.data.bangding){
      data = {
        mobile:that.data.phone,
        mobile_code: that.data.code
      }
    }else{
      data = {
        mobile: that.data.phone,
        mobile_code: that.data.code,
        old_mobile: that.data.mobile_old,
        old_mobile_code: that.data.mobile_code_old,
      }
    }
    // data.token = util.getToken()
    util.postJSON({ apiUrl: apiurl.mobileUpdate
    , data: data }, function (res) {
      var result = res.data.result
      if(that.data.bangding){
        util.alert("手机号绑定成功！")
        util.navigateBack()
      }else{
        util.alert("手机号修改成功！")
        util.navigateBack(2)
      }
    })
  }
})
