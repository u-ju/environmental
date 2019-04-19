// pages/businessProductview/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shop_id:'',
    page:'',
    list:[0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id){
      this.setData({
        shop_id: options.id
      })
      this.init()
    }
    // this.setData({
    //   shop_id: 3
    // })
    // this.init()
  },
  init(page=1) {
    var that = this;
    console.log(apiurl.shopSettled_goodsIndex + that.data.shop_id + "&page=" + page)
    util.getJSON({ apiUrl: apiurl.shopSettled_goodsIndex + that.data.shop_id + "&page=" + page }, function (res) {
      
      var result = res.data.result
      var list = result.list
      that.setData({
        list: list,
        page: result.page,
      })
      wx.hideLoading()
    })
  },
  edit(e){
    console.log(e.currentTarget.dataset.spu_id)
    wx.navigateTo({
      url: '../businessProductAdd/index?id=' + this.data.shop_id + "&spu_id=" + e.currentTarget.dataset.spu_id,
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

  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    util.getJSON({ apiUrl: apiurl.shopSettled_goodsIndex + that.data.shop_id + "&page=1" }, function (res) {
      var result = res.data.result
      console.log(result)
      that.setData({
        list: result.list,
        page: result.page,
        last: false
      })
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
    })

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    // 页数+1
    if (Number(that.data.page.current_page) != Number(that.data.page.last_page)) {
      that.init(Number(that.data.page.current_page) + 1)
    } else {
      that.setData({
        last: true
      })
      wx.hideLoading()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})