// pages/qrcode/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:false,
    qr:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })


  if (options.q) {
      this.setData({
        qr: options.q,
        // show:true
      })
      // this.link(options.q)
    }
  },
  link(qr){
    var that= this;
    util.postJSON({ apiUrl: apiurl.decode, data: { qrcode: decodeURIComponent(qr) } }, function (res1) {
      
      var result = res1.data.result;
      if (result.action.length > 1) {
        var action = JSON.stringify(result.action);
        var code = JSON.stringify(result.code);
        app.globalData.action = result.action
        app.globalData.code = result.code
        wx.reLaunch({
          url: '../edcs_choose/edcs_choose?action=' + action + '&code=' + code,
        })
      } else {
        util.postJSON({ apiUrl: apiurl.action, data: { action: result.action[0].key, code: result.code } }, function (res2) {
          var result2 = res2.data.result;
          that.setData({
            qr: ''
          })
          if (result2.control) {
            var url = result2.control.control
            if (JSON.stringify(result2.control.params) != "{}") {
              url = url + "?1=1"
              for (var i in result2.control.params) {
                url = url + "&" + i + "=" + result2.control.params[i]
              }
            }
            
            wx.hideLoading()
            if (url.indexOf('index/index')>-1){
              wx.reLaunch({
                url: url
              })
            }
            wx.navigateTo({
              url: url,
            })
          } else {
            util.alert(res2.data.message)
          }
        }, function (res3) {
          if (res3.data.status == 414) {
            util.info_dialog(res3.data.message)
            setTimeout(function () {
              wx.reLaunch({
                url: '../index/index'
              })
            }, 3000);
          }
        })
      }

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
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1].route;
    if (!wx.getStorageSync('token') && wx.getStorageSync('pagesroute') == currPage) return wx.setStorageSync('pagesroute', '')
    if(this.data.qr){
      this.link(this.data.qr)
    }else{
      wx.navigateBack()
    }
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