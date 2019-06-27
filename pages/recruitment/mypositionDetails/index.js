// pages/recruitment/recruit/mypositionDetails/index.js
const app = getApp()
var util = require('../../../utils/util.js');
var apiurl = require('../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visiblet: true,
    visibler: false,
    item: ['初中及以下', '高中','大专']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var money1 = [], money2 = []
    for (var i = 1; i < 24; i++) {
      money1.push(i + "K")
      money2.push(i + "K")
    }
    this.setData({
      money1: money1,
      money2: money2,
      money: money2
    })
  },
  bindChange(e){
    // console.log(e)
    if (this.data.start != e.detail.value[0]){
      var arr = util.copyarr(this.data.money)
      var arr2 = arr.slice(e.detail.value[0]+1, arr.length - 1);
      this.setData({
        money2: arr2,
        start: e.detail.value[0]
      })
    }
  },
  open() {
    this.setData({
      ['visible' + e.target.dataset.name]: true
    })
  },
  colse(e){
    this.setData({
      ['visible' + e.target.dataset.name]: false
    })
  },
  ch_del() {
    this.setData({
      visiblet: false
    })
  },
  ch_true() {
    this.setData({
      visiblet: false
    })
  },
  pickstart(e){
    console.log(e)
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