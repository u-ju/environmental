// pages/bill/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        "key": "0",
        "title": "全部",
      },
      {
        "key": "1",
        "title": "待还款",
      },
      {
        "key": "2",
        "title": "已还款",
      },
    ],
    current: '0',
    list:[],
    page:{},
    order_status:'',
    title: ["账单查询", "历史账单", "账单查询"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    }) 
    if (options.current != '' && options.current !=undefined){
      this.setData({
        current: options.current,
        key: options.current,
        index: options.current,
        order_status: options.current
      })
      
    }   
    wx.setNavigationBarTitle({
      title: this.data.title[this.data.current],
    })                        
    this.init()
  },
  onChange(e) {
    console.log('onChange', e)
    this.setData({
      current: e.detail.key,
    })
  },
  onTabsChange(e) {
    console.log('onTabsChange', e)
    wx.showLoading({
      title: '加载中',
    })
    const { key } = e.detail
    const index = this.data.tabs.map((n) => n.key).indexOf(key)
    var order_status = index;
    this.setData({
      key,
      index,
      order_status: order_status
    })
    wx.setNavigationBarTitle({
      title: this.data.title[index],
    }) 
    console.log()
    this.init()
  },
  init(page = 1) {
    var that = this;
    var order_status = that.data.order_status;
    if (order_status==0){
      order_status=''
    }
    util.getJSON({ apiUrl: apiurl.userNper_orderIndex + "?page=" + page + "&order_status=" + order_status }, function (res) {
      var result = res.data.result
      var list = result.list
      if (page != 1) {
        list = that.data.list.concat(list)
      }
      that.setData({
        list: list,
        page: result.page,
      })
      wx.hideLoading()
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    var order_status = that.data.order_status;
    if (order_status == 0) {
      order_status = ''
    }
    util.getJSON({ apiUrl: apiurl.userNper_orderIndex+"?page=1&order_status=" + order_status}, function (res) {
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
      that.init(Number(that.data.page.current_page) + 1)
    } else {
      that.setData({
        last: true
      })
      wx.hideLoading()
    }
  },
  detail(e){
    console.log(e.currentTarget.dataset)
    if (e.currentTarget.dataset.source=="order"){
      wx.navigateTo({
        url: '../order/index?source_ext=' + JSON.stringify(e.currentTarget.dataset.source_ext.order_id),
      })
    }
  },
  bill(e) {
    wx.navigateTo({
      url: '../payment_details/index?id=' + e.currentTarget.dataset.id,
    })
  }
})