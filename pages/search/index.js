// pages/search/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result:[],
    search:''
  },
  search(e){
    this.setData({
      search: e.detail.value
    })
    
  },
  searchSubmit(){
    console.log(this.data.search)
    this.init(this.data.search)
  },
  init(keywords='') {
    var that = this;
    util.getJSON({ apiUrl: apiurl.search + keywords }, function (res) {
      var result = res.data.result
      that.setData({
        result: result
      })
    })
    
  },
  link(e) {
    if (JSON.stringify(e.currentTarget.dataset.link) == "{}") {
      return false
    }
    var url = e.currentTarget.dataset.link.control
    if (JSON.stringify(e.currentTarget.dataset.link.params) != "{}") {
      // for (var i in e.currentTarget.dataset.link.params) {
      //   console.log(i, e.currentTarget.dataset.link.params[i])
      url = url + "?keywords" + "=" + e.currentTarget.dataset.link.params['keywords']
      // }
    }
    wx.navigateTo({
      url: url,
    })

    // var controlContrast = getApp().globalData.controlContrast, url = '';
    // for (var i in controlContrast) {
    //   if (controlContrast[i].control == e.currentTarget.dataset.attach.control) {
    //     url = controlContrast[i].contrast
    //   }
    // }
    // wx.navigateTo({
    //   url: url + "?keywords=" + e.currentTarget.dataset.attach.params.keywords,
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // if (app.globalData.controlContrast.length == 0) {
    //   util.getJSON({ apiUrl: apiurl.controlContrast }, function (res) {
    //     var result = res.data.result;
    //     getApp().globalData.controlContrast = result;

    //   })
    // }
    
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