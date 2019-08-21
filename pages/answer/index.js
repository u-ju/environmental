// pages/answer/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    conf:{},
    choice:0,
    wrong_key:-1
  },
  initconf() {
    var that = this;
    util.getJSON({ apiUrl: apiurl.question.conf}, function (res) {
      var result = res.data.result;
      that.setData({
        conf: result,
      })
      util.hideLoading()
    })
  },
  initrandom() {
    var that = this;
    util.getJSON({ apiUrl: apiurl.question.random }, function (res) {
      var result = res.data.result;
      that.setData({
        result: result,
        choice: 0,
        question: result.question,
        gain_integral: result.gain_integral,
        total_integral: result.total_integral,
      })
      util.hideLoading()
    })
  },
  initprev() {
    var that = this;
    util.getJSON({ apiUrl: apiurl.question.prev + that.data.question.id }, function (res) {
      var result = res.data.result;
      that.setData({
        result: result,
        choice: 1,
        wrong_key:-1,
        question: result.question,
        gain_integral: result.gain_integral,
        total_integral: result.total_integral,
        right_answer: result.right_answer,
      })
      console.log(result)
      util.hideLoading()
    })
  },
  choose(e){
    if (this.data.choice) return
    var that = this;
    var data = { id: that.data.question.id, answer: JSON.stringify([e.currentTarget.dataset.key])}
    util.postJSON({ apiUrl: apiurl.question.respond,data:data }, function (res) {
      var result = res.data.result;
      that.setData({
        choice: 1,
        wrong_key: result.respond == 0 ? e.currentTarget.dataset.index : -1,
        right_answer: result.right_answer,
        add_integral: result.add_integral 
      })
      if (result.respond==1){
        setTimeout(function(){
          that.setData({
            gain_integral: (that.data.gain_integral - 0) + Number(result.add_integral)
          })
        },3000)
      }
      util.hideLoading()
    })
    // console.log(e.currentTarget.dataset.key == 0 ? e.currentTarget.dataset.index : -1)
    // this.setData({
    //   choice:1,
    //   wrong_key: e.currentTarget.dataset.key == 0 ? e.currentTarget.dataset.index:-1,
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initconf()
    this.initrandom()
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