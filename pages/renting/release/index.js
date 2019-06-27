// pages/renting/release/index.js
const app = getApp()
var util = require('../../../utils/util.js');
var apiurl = require('../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:false,
    lunbo:[],
    upload_picture_list:[]
  },
  show() {
    this.setData({
      show: true
    })
  },
  unshow() {
    this.setData({
      show: false
    })
  },
  uploadpic(e) {
    var that = this;
    var index = e.currentTarget.dataset.indexnum;

    util.uploadpic(that, 1, 'upload_picture_list', '', function (images) {
      console.log(images)
      that.setData({
        upload_picture_list: images,
      });
      for (var j in images) {
        if (images[j]['upload_percent'] == 0) {
          //调用函数
          util.upload_pic(apiurl.upload_image, that, images, j, function (e) {
            that.setData({
              upload_picture_list: e,
            });
            util.hideLoading()
          }, function (e) {
            that.setData({
              upload_picture_list: e,
            });
          })
        }
      }
    })
  },
  uploadpic1(e) {
    var that = this;
    var index = e.currentTarget.dataset.indexnum;

    util.uploadpic(that, 9, 'lunbo', '', function (images) {
      console.log(images)
      that.setData({
        lunbo: images,
      });
      for (var j in images) {
        if (images[j]['upload_percent'] == 0) {
          //调用函数
          util.upload_pic(apiurl.upload_image, that, images, j, function (e) {
            that.setData({
              lunbo: e,
            });
            util.hideLoading()
          }, function (e) {
            that.setData({
              lunbo: e,
            });
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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