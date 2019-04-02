// pages/edcs_choose/edcs_choose.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
var link = require('../../utils/link.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    action:[],
    code:'',
    visible1:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.action){
      
      this.setData({
        action: JSON.parse(options.action),
        code: JSON.parse(options.code)
      })
      
    }
  },
  onClose1(){
    this.setData({
      visible1: false
    })
    wx.navigateBack()
  },
  bag(e){
    console.log(e)
    var data = { action: e.currentTarget.dataset.key, code: this.data.code }
    console.log(data)
    util.postJSON({ apiUrl: apiurl.action, data: data}, function (res2) {
      var result2 = res2.data.result;
      console.log(result2)
      if (result2.control){
        // JSON.stringify(result2.control) != "{}"
        var url = result2.control.control
        console.log(url)
        if (JSON.stringify(result2.control.params) != "{}") {
          url = url + "?1=1"
          for (var i in result2.control.params) {
            console.log(i, result2.control.params[i])
            url = url + "&" + i + "=" + result2.control.params[i]
          }
        }
        console.log(url)
        wx.reLaunch({
          url: url,
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