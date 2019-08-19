// pages/login/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isback: false
  },
  formSubmit(e){
    var arr = { username: "请输入账号", password: "请输入密码"}
    var data = e.detail.value
    for (var j in arr){
      for (var i in data){
        if (i == j && !data[i]){
          console.log(arr[j])
          return util.alert1(arr[j])
        }
      }
    }
    var that = this;
    util.postJSON({ apiUrl: apiurl.login, data: data }, function (res) {
      wx.setStorageSync("token", res.data.result.token)
      wx.reLaunch({
        url: '../personal_center/personal_center',
      })
    })
    console.log(e)
  },
  index() {
    this.setData({
      isback: true
    })
    wx.navigateBack()
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
                  isback: true
                })

                return wx.navigateBack({
                  delta: 2
                })
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
                      return wx.navigateBack({
                        delta:2
                      })
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      logo: app.globalData.config.logo
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
    // if (this.data.isback) return
    // wx.reLaunch({
    //   url: '../index/index',
    //   fail(){
    //     wx.reLaunch({
    //       url: '../../index/index',
    //     })
    //   }
    // })
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