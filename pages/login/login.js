// pages/login/login.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled:true,
    phone:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  phone(e){//输入验证手机号格式
    // console.log(e.detail.value)
    var that = this, disabled = true;

    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    
    if (e.detail.value.length == 11 && myreg.test(e.detail.value)){
      // console.log(e.detail.value.length)
      disabled = false
    }else{
      disabled = true
    }
    that.setData({
      disabled: disabled
    })
  },
  formSubmit(e){//发送验证码
    // console.log(e.detail.value.phone)
    util.postJSON({ apiUrl: apiurl.captcha, data: { mobile: e.detail.value.phone, source:"login"}}, function (res) {
      var result = res.data.result
      util.alert(res.data.message)
      wx.navigateTo({
        url: '../code/code?mobile=' + e.detail.value.phone + '&verification=' + result.mobile_code,
      })
      
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