// pages/code/code.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
var interval = null //倒计时函数
Page({
  data: {
    times: '重新发送', //倒计时 
    currentTime: 61,
    disabled: true,
    // 输入框参数设置
    inputData: {
      input_value: "",//输入框的初始内容
      value_length: 0,//输入框密码位数
      isNext: false,//是否有下一步的按钮
      get_focus: true,//输入框的聚焦状态
      focus_class: true,//输入框聚焦样式
      value_num: [1, 2, 3, 4,5,6],//输入框格子数
      height: "74rpx",//输入框高度
      width: "720rpx",//输入框宽度
      see: true,//是否明文展示
      interval: true,//是否显示间隔格子
      send_code:true
    },
    code: "",
    mobile: "",
    verification: ""
  },

  // 当组件输入数字6位数时的自定义函数
  
  valueNow(e){
    // console.log(e.detail)
    var that = this, disabled = true,code = "";
    
    if (e.detail.length == 6) {
      console.log(e.detail + "---------" + that.data.verification)
      if (e.detail != that.data.verification){
        util.alert("验证码错误")
      }else{
        disabled = false
      }
      
    }
    code = e.detail
    that.setData({
      disabled: disabled,
      code:code,
    })
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      mobile: options.mobile,
      verification: options.verification
    })
    console.log(this.data)
    
    that.timedown()
    // wx.getSystemInfo({
    //   success: function (res) {
    //     console.log(res.model)
    //     console.log(res.pixelRatio)
    //     console.log(res.windowWidth)
    //     console.log(res.windowHeight)
    //     console.log(res.language)
    //     console.log(res.version)
    //     console.log(res.platform)
    //   }
    // })
    util.hideLoading()
  },
  submit(e){//登录
  var that =this
    console.log(e)
    console.log(this.data.inputData)
    console.log(this.data.inputData.input_value)
    this.setData({
      disabled:true
    })
    util.postJSON({ apiUrl: apiurl.mobileLogin, data: { mobile: that.data.mobile, mobile_code: that.data.code } }, function (res) {
      console.log(res)
    })
  },
 getCode: function (options) {//获取验证码
    var that = this;
    
   util.postJSON({ apiUrl: apiurl.captcha, data: { mobile: that.data.mobile, source: "login"} }, function (res) {
      var result = res.data.result;
      var result = res.data.result
      util.alert(res.data.message)
      that.setData({
        verification: result.mobile_code
      })
      that.timedown()
    })
  },
  timedown(){
    console.log("zhixn")
    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        times: currentTime + 'S',
        send_code:true
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          times: '重新发送',
          currentTime: 61,
          send_code: false
        })
      }
    }, 100)
  }

})