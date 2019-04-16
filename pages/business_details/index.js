// pages/business_details/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
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
      { image: 'http://wyhb.zhanghi.cn/storage/views/home/background@3x.png' },
      { image: 'http://wyhb.zhanghi.cn/storage/views/home/background@3x.png' },
      { image: 'http://wyhb.zhanghi.cn/storage/views/home/background@3x.png' },
    ],
    result: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    options['t_shop_id'] = 1
    if (options.t_shop_id) {
      util.getJSON({ apiUrl: apiurl.shop_show, data: { shop_id: options.t_shop_id } }, function (res) {
        var result = res.data.result
        that.setData({
          result: result
        })
        util.hideLoading()
      })
    }
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
  location() {
    var that = this;
    var result = that.data.result;
    var data = {
      latitude: result.latitude,
      longitude: result.longitude,
      address: result.address,
      area_name: result.area_name,
    }
    wx.navigateTo({
      url: '../delivery_station/index?data=' + JSON.stringify(data),
    })
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