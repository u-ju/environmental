// pages/housekeeping_detail/index.js
const app = getApp()
var util = require('../../../utils/util.js');
var apiurl = require('../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,//显示面板指示点
    autoplay: true,//自动播放
    beforeColor: "white",//指示点颜色
    afterColor: "coral",//当前选中的指示点颜色
    interval: 5000,
    duration: 1000,
    banner: [
    ],
    result: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    options.id=1
    // if (options.id) {
    util.getJSON({ apiUrl: apiurl.idle.show + options.id }, function (res) {
        var result = res.data.result
        that.setData({
          result: result,
          id: options.id
        })
        util.hideLoading()
      })
    // }
  },
  calling: function (e) {//拨打电话
    console.log(e.target.dataset.phone)
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.phone, //此号码并非真实电话号码，仅用于测试
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  location() {
    var that = this;
    var result = that.data.result;

    wx.openLocation({
      latitude: Number(result.latitude),
      longitude: Number(result.longitude),
      scale: 28,
      name: result.area_name,
      address: result.address,
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
  calling: function (e) {//拨打电话
    console.log(e.target.dataset.phone)
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.phone, //此号码并非真实电话号码，仅用于测试
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    var pjdata = {
      id: this.data.id
    }
    return util.share('啄木鸟环保', '../dynamic/dynamic&pjdata=' + JSON.stringify(pjdata))
    // return {
    //   title: '啄木鸟环保',
    //   path: '/pages/housekeeping_detail/index?id=' + that.data.id + "&pjurl='../housekeeping_detail/index?id='" + that.data.id,
    //   success: function (res) {
    //     // 转发成功
    //     wx.showToast({
    //       title: "分享成功",
    //       icon: 'success',
    //       duration: 2000
    //     })
    //   },
    //   fail: function (res) {
    //     // 分享失败
    //   },
    // }
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
  onShareAppMessage: function () {
    var pjdata = {
      id: this.data.id
    }
    return util.share('啄木鸟环保', '../housekeeping_detail/index&pjdata=' + JSON.stringify(pjdata))
  }

})