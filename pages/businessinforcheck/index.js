// pages/businessinforcheck/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    util.getJSON({ apiUrl: apiurl.travelPerson_index }, function (res) {
      console.log(res.data.result.list)
      that.setData({
        list: res.data.result.list
      })
    })
  },
  edit(e){
    console.log(e.currentTarget.dataset.item)
    var item = JSON.stringify(e.currentTarget.dataset.item)
    console.log(item)
    if (item==undefined){
      item = ''
    }
    wx.navigateTo({
      url: '../businessinforedit/index?item=' + item ,
    })
  },
  del(e){
    console.log()
    var data = [], that = this;
    wx.showModal({
      title: '提醒',
      content: '是否确定删除该联系人？',
      cancelText: '否',
      cancelColor: '#2EB354',
      confirmText: '是',
      confirmColor: '#444444',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          data["person_id[0]"] = e.currentTarget.dataset.person_id
          util.postJSON({ apiUrl: apiurl.bankCard_destroy, data: data }, function (res) {
            util.alert(res.data.message)
            that.init()
          })
        } else {
          console.log('用户点击取消')
        }

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