// pages/operationalData/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time:[
      { key: 'days', name: '日' },
      { key: 'week', name: '周' },
      { key: 'month', name: '月' },
      { key: 'quarter', name: '季度' },
      { key: 'year', name: '年' },
    ],
    curr:'days'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      shop_id: options.id
      // 
    })
    this.init(this.data.curr)
  },
  tabC(e){
    console.log(e)
    var key = e.currentTarget.dataset.key
    if (key!=this.data.curr){
      this.init(key)
    }
    this.setData({
      curr: key,
      currindex: e.currentTarget.dataset.index-1
    })
  },
  init(curr){
    var that = this;
    util.getJSON({ apiUrl: apiurl.shop_stat + that.data.shop_id + "&stat_type=" + curr }, function (res) {
      var result = res.data.result

      var list = result.list
      that.setData({
        list: list
      })
      util.hideLoading()
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