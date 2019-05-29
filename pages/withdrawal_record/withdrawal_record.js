// pages/withdrawal_record/withdrawal_record.js
const app = getApp() 
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentData: 0,
    tab: ["待审核", "提现成功","提现失败"],
    news: [],
    cate_id: 1,
    last: false,
    page:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // util.getJSON({ apiUrl: apiurl.wallet }, function (res) {
    //   var result = res.data.result;
    //   that.setData({
    //     tab: result.withdraw_status
    //   })
    // })
    this.setData({
      tab: app.globalData.config.withdraw_status || tab,
      url: options.url
    })
    that.init()
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
  //获取当前滑块的index
  bindchange: function (e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })
  },
  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    const that = this;
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.target.dataset.current,
        cate_id: e.target.dataset.cate_id,
        list:[0]
      })
      that.init(e.target.dataset.cate_id)
    }
  },
  init(cate_id = this.data.tab[0]["id"], page = 1) {
    var that = this;
    util.getJSON({
      apiUrl: apiurl[that.data.url] + "?status=" + cate_id+"&page="+page
    }, function (res) {
      var result = res.data.result
      var list = result.list;
      if (page != 1) {
        list = that.data.news.concat(list)
      }
      that.setData({
        list: list,
        page: result.page,
        last: false
      })
      wx.hideLoading()
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
    wx.showNavigationBarLoading();
    var that = this;
    util.getJSON({
      apiUrl: apiurl[that.data.url] + "?status=" + that.data.cate_id + "&page=" + 0
    }, function (res) {
      var result = res.data.result
      var list = result.list;
      if (page != 1) {
        list = that.data.news.concat(list)
      }
      that.setData({
        list: list,
        page: result.page,
        last: false
      })
      wx.hideLoading()
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
      that.init(that.data.cate_id, Number(that.data.page.current_page) + 1)
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