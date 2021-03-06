// pages/setting/setting.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      items:[
        { title:"隐私保护政策",url:''},
        { title: "关于我们", url: '../about/about' },
        { title: "反馈建议", url: '../feedback/index' },
        
      ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideLoading()
    var items = [
      { title: "隐私保护政策", url: '../page/index?url=' + app.globalData.config.protocol.privacy },
      { title: "关于我们", url: '../about/about' },
      { title: "反馈建议", url: '../feedback/index' },
    ]
    this.setData({
      items: items,
      version: app.globalData.config.version
    })
  },
  link(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  login(e){
    wx.navigateTo({
      url: '../login/login',
    })
  },
  clear(){
    wx.clearStorage()
    wx.clearStorageSync()
    util.alert1('清空缓存成功')
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