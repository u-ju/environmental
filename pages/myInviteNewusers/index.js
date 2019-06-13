// pages/myInviteNewusers/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[0],
    visible3: false,
    value:'',
    fgColor: 'black',
    // '我邀请的用户', '我邀请的商家'
    tab: [
      { name: '我邀请的用户', url: 'shareUserIndex' },
      { name: '我邀请的商家', url: 'shareShopIndex' },
    ],
    curre: "shareUserIndex"
  },
  tabcur(e){
    if (e.currentTarget.dataset.url==this.data.curre){
      return
    }
    this.setData({
      curre: e.currentTarget.dataset.url
    })
    this.init()
  },
  onLoad: function (options) {
    util.loading()
    var that = this;
    util.getJSON({ apiUrl: apiurl.share }, function (res) {
      var result = res.data.result

      that.setData({
        result: result,
        value: result.share_qrcode,
        stat: result.stat
      })
      util.hideLoading()
    })
    that.init()
  },
  init(page = 1) {
    var that = this;

    util.getJSON({ apiUrl: apiurl[that.data.curre] + "?page=" + page }, function (res) {
      var result = res.data.result
      var list = result.list
      // if (page != 1) {
      //   list = that.data.list.concat(list)
      // }
      // list=[
      //   { nickname: 'dsadsa', effect_time: '201909090', status_name: 'cdai', avatar:'../../images/logoi.png'}
      // ]
      that.setData({
        list: list,
        page: result.page,
      })
      util.hideLoading()
    })
  },
  open3(e) {
    this.setData({
      visible3: true
    })

  },
  close3() {
    this.setData({
      visible3: false,
    })
  },
  onClose3() {
    this.setData({
      visible3: false,
    })
  },
  shop_info(e){
    wx.navigateTo({
      url: '../business_details/business_details?id=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    util.getJSON({ apiUrl: apiurl[that.data.curre] + "?page=1"  }, function (res) {
      var result = res.data.result
      console.log(result)
      that.setData({
        news: result.list,
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
      that.init( Number(that.data.page.current_page) + 1)
    } else {
      that.setData({
        last: true
      })
      wx.hideLoading()
    }


  },
})