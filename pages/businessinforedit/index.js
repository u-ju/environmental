// pages/businessinforedit/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:'travelPerson_store'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.item){
      var item = JSON.parse(options.item)
      console.log(item)
      this.setData({
        first_name: item.first_name,
        first_name_pinyin: item.first_name_pinyin,
        last_name: item.last_name,
        last_name_pinyin: item.last_name_pinyin,
        name: item.name,
        idcard: item.idcard,
        person_id: item.person_id,
        url:'travelPerson_update'
      })
    }
  },
  formSubmit(e){
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