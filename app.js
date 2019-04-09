//app.js
var util = require('utils/util.js');
var apiurl = require('utils/api.js');
// 引入SDK核心类
var QQMapWX = require('utils/qqmap-wx-jssdk.min.js');
var bmap = require('utils/bmap-wx.min.js')
var qqmapsdk;
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || [],that =this;

    
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
    that.address()
  },
  address() {
    var that = this;
    // 新建百度地图对象 
    var BMap = new bmap.BMapWX({
      ak: 'DebUHwMKH2yOlHOHlXiVlZTeCuFnRgZo'
    });
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      console.log(data)
      var wxMarkerData = data.wxMarkerData;
      that.globalData.longitude = wxMarkerData[0].longitude
      that.globalData.latitude = wxMarkerData[0].latitude
    }
    // 发起regeocoding检索请求 
    BMap.regeocoding({
      fail: fail,
      success: success,
    });
  },
  globalData: {
    userInfo: null,
    baseUrl: "https://wyhb.zgwyhb.com/api",
    longitude: 104.05293,
    latitude: 30.69015,
    config:[],
    controlContrast:[],
    appid:'wx312b45ec2ec4d345'
  }
})