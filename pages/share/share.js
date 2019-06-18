// pages/share/share.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.loading()
    var that = this;
    util.getJSON({ apiUrl: apiurl.share}, function (res) {
      var result = res.data.result
      that.setData({
        result: result
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

    var that = this;
    var pjdata = {
      share_gene:that.result.share_gene
    }
    return util.share('啄木鸟环保', '../index/index&pjdata=' + JSON.stringify(pjdata))
    // var userId = 'puju';

    // return {
    //   title: '啄木鸟环保',
    //   path: '/pages/index/index?share_gene=' + that.result.share_gene, //这里拼接需要携带的参数
    //   success: function (res) {
    //     console.log("转发成功" + res);
    //   }
    // }
  }
})