// pages/idlement/idle/myposition/index.js
var app = getApp()
var util = require('../../../utils/util.js');
var apiurl = require('../../../utils/api.js');
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

    this.init()
  },
  del(e) {
    var that = this, data=[];
    console.log(e)
    var dat = {}
    data["id[0]"] = e.currentTarget.dataset.id
    util.popoutc('是否确定删除该閑置物品', '否', '#444444', '是', '#4FD6F0', function () {
      console.log("取消")
    }, function () {
      util.postJSON({ apiUrl: apiurl.idle.infoDestroy }, function (res) {
        util.alert1(res.data.message)
        that.init()
      })
    })
  },
  detail(e){
    wx.navigateTo({
      url: '../In/index?id=' + e.currentTarget.dataset.id,
    })
  },
  init(page = 1) {
    var that = this;
    util.getJSON({
      apiUrl: apiurl.idle.infoIndex + '?page=' + page,
    }, function (res) {
      var result = res.data.result
      var list = result.list
      if (page != 1) {
        list = that.data.list.concat(list)
      }
      that.setData({
        list: list,
        page: result.page,
        last: false
      })
      util.hideLoading()
    })
  },
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    util.getJSON({ apiUrl: apiurl.idle.infoIndex + '?page=1' }, function (res) {
      var result = res.data.result
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
      that.init(that.data.cate_id, Number(that.data.page.current_page) + 1)
    } else {
      that.setData({
        last: true
      })
      wx.hideLoading()
    }
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },


})