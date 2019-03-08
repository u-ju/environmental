// pages/modify_nickname/modify_nickname.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sure:true,
    name:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.name){
      this.setData({
        name: options.name
      })
    }
  },
  name(e){
    // console.log(e.detail.value)
    if (e.detail.value){
      this.setData({
        sure: false,
      })
    }else{
      // util.alert("昵称不能为空")
      this.setData({
        sure: true,
      })
    }
  },
  formSubmit(e){
    // console.log(e.detail.value.name)
    util.postJSON({ apiUrl: apiurl.user_update, data: { token: util.getToken(), nickname: e.detail.value.name } }, function (res) {
      var result = res.data.result
      util.info_dialog(res.data.message)
      wx.navigateTo({
        url: '../personal_center/personal_center',
      })
      // util.hideLoading()
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