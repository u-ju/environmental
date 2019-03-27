// pages/qrcode/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })


  if (options.q) {
    console.log(options.q)
    console.log(decodeURIComponent(options.q))
    // var str = options.q
    // var qrcode = str.split('/qrcode/')[1]
    util.postJSON({ apiUrl: apiurl.decode, data: { qrcode: decodeURIComponent(options.q) } }, function (res1) {
      console.log(options.q)
      if (res1.data.status == 801){
        wx.reLaunch({
            url: '../../index/index',
          })
        }
        var result = res1.data.result;
        if (result.action.length > 1) {
          var action = JSON.stringify(result.action);
          var code = JSON.stringify(result.code);
          wx.reLaunch({
            url: '../edcs_choose/edcs_choose?action=' + action + '&code=' + code,
          })
        } else {
          util.postJSON({ apiUrl: apiurl.action, data: { action: result.action[0].key, code: result.code } }, function (res2) {
            var result2 = res2.data.result;
            if (result2.control) {
              // var controlContrast = getApp().globalData.controlContrast, url = '';
              // for (var i in controlContrast) {
              //   if (controlContrast[i].control == result2.control) {
              //     url = controlContrast[i].contrast
              //   }
              // }
              // if (result2.params.order_id) {
              //   url = url + result2.params.order_id
              // } else if (result2.params.shop_id) {
              //   url = url + result2.params.shop_id
              // }
              // wx.reLaunch({
              //   url: url,
              // })
              var url = result2.control.control
              if (JSON.stringify(result2.control.params) != "{}") {
                url = url + "?1=1"
                for (var i in result2.control.params) {
                  console.log(i, result2.control.params[i])
                  url = url + "&" + i + "=" + result2.control.params[i]
                }
              }
              wx.hideLoading()
              wx.reLaunch({
                url: url,
              })
            } else {
              util.alert(res2.data.message)
            }
          })
        }

      })
    }
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