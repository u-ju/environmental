//app.js
import { ToastPannel } from './Components/appToast/appToast'
var util = require('utils/util.js');
var apiurl = require('utils/api.js');
// 引入SDK核心类
var QQMapWX = require('utils/qqmap-wx-jssdk.min.js');
var bmap = require('utils/bmap-wx.min.js')
var qqmapsdk;
App({
  ToastPannel,
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || [],that =this;

    // util.address(function(e){
    //   // console.log(e)
    // })
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    // that.address()
    // that.config()
  },
  config(){
    var that = this;
    util.getJSON({ apiUrl: apiurl.config }, function (res) {
      var result = res.data.result;
      getApp().globalData.config = result;
      // that.setData({
      //   config: res.data.result
      // })
    })
  },
  
  globalData: {
    userInfo: null,
    baseUrl: apiurl.base,
    longitude: 104.05293,
    latitude: 30.69015,
    config:[],
    controlContrast:[],
    appid: util.wx_appid,
    order_detail:[],
    front_tshop_index:[],
    settle_withdraw_flow:[],
    balance_withdraw_flow:[],
    action:'',
    code:'',
    desc:"请填写正确的小区信息，否则将影响您的部分权益",
    hint:[],
    is_:'',
    front_share_home:[],
    company_info:'',
    id:'',
    config_tag:[],
    shop:[],
    avatar:'',
    imgsrc:''
  }
})