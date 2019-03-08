// pages/sign/sign.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ing:0,
    list: [],
    status:0,
    task_name:'',
    integral:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.loading()
    var that = this;
    that.init()
  },
  qiandao(){
    var that = this;
    util.postJSON({ apiUrl: apiurl.task_update,data: { task_key: "continue_signin" } }, function (res) {
      util.alert(res.data.message);
      that.init()
    })
  },
  init(){
    var that = this;
    util.getJSON({ apiUrl: apiurl.integral }, function (res) {
      var result = res.data.result
      that.setData({
        list: result.list
      })
      util.hideLoading()
    })
    util.getJSON({ apiUrl: apiurl.task_show, data: { task_key: "continue_signin" } }, function (res) {
      var result = res.data.result
      that.setData({
        ing: result.attach.have_count,
        status: Number(result.status),
        task_name: result.task_name,
        integral: result.reward.integral
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