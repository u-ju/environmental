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
    source: "login",
    isback:false
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
    // wx.setNavigationBarTitle({
    //   title: title
    // })
    util.hideLoading()
  },
  index(){
    wx.navigateTo({
      url: 'index',
    })
  },
  bindGetUserInfo(e) {
    // wx.setStorageSync("token", 1)
    var that = this;
    if (e.detail.userInfo) {
      util.loading()
      var token = ""
      wx.login({
        success: function (res) {
          var data = {
            wx_code: res.code,
            wx_appid: util.wx_appid
          }
          if (res.code) {
            util.postJSON({
              apiUrl: apiurl.wechatLetAttemptLogin,
              data: data,
              token: "huhu"
            }, function (res1) {
              if (res1.data.result.token) {
                wx.setStorageSync("token", res1.data.result.token)
                token = res1.data.result.token
                that.setData({
                  token: token,
                  isback:true
                })
                
                return wx.navigateBack()
              } else {
                wx.getUserInfo({
                  success(res2) {
                    util.postJSON({
                      apiUrl: apiurl.wechatLetLogin,
                      data: {
                        wx_appid: util.wx_appid,
                        share_gene: wx.getStorageSync('share_gene'),
                        session_key: util.base64encode(util.utf16to8(res1.data.result.wx_user.session_key)),
                        iv: util.base64encode(util.utf16to8(res2.iv)),
                        encrypt_data: util.base64encode(util.utf16to8(res2.encryptedData))
                      },
                      token: "huhu"
                    }, function (res3) {
                      wx.setStorageSync("token", res3.data.result.token)
                      token = res3.data.result.token
                      that.setData({
                        token: token,
                        isback: true
                      })
                      return wx.navigateBack()
                    })
                  }
                })
              }
            }, function () {
              util.alert('授权失败')
            }, function () {
              util.alert('授权失败')
            })
          }
        },
        fail(w) {
          util.alert('授权失败')
        }
      })
    } else {
      // util.alert("为了您更好的体验,请先同意授权")
      console.log(e)
    }

  },
  onUnload: function () {
    // if (this.data.isback) return
    // wx.reLaunch({
    //   url: '../index/index',
    //   fail() {
    //     wx.reLaunch({
    //       url: '../../index/index',
    //     })
    //   }
    // })
  }
})
// 18583750250