// pages/installment/installment.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,//显示面板指示点
    autoplay: false,//自动播放
    beforeColor: "#DCDCDC",//指示点颜色
    afterColor: "#27AAD9",//当前选中的指示点颜色
    interval: 5000,
    duration: 1000,
    showmodel:false,
    list:[0],
    page:{},
    moredescnum:1,
    keywords:'',
    images:[]
  },
  model(){
    this.setData({
      showmodel: !this.data.showmodel
    })
  },
  detail(e){
    console.log(e.currentTarget.dataset.sku_id)
    wx.navigateTo({
      url: '../installment_details/installment_details?id=' + e.currentTarget.dataset.sku_id 
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.loading()
    var that = this
    util.getJSON({ apiUrl: apiurl.goodsHome }, function (res) {
      
      var result = res.data.result
      that.setData({
        banner: result.banner,
        desc: result.desc
      })
      util.hideLoading()
    })
    if (options.keywords) {
      var keywords = options.keywords
      this.setData({
        keywords: keywords,
        search: options.keywords,
        
      })
      this.init( 1, keywords)
    }else{
      this.init()
    }
  },
  moredesc(){
    this.setData({
      moredescnum: !this.data.moredescnum
    })
  },
  init(page = 1, keywords='') {
    var that = this;
    if (that.data.keywords != '' && that.data.keywords != undefined) {
      keywords = that.data.keywords
    }
    util.getJSON({ apiUrl: apiurl.goods + "?page=" + page + "&source=exchange" + "&keywords=" + keywords }, function (res) {
      // +"&source=exchange" 
      var result = res.data.result
      var list = result.list
      if (page != 1) {
        list = that.data.news.concat(list)
      }
      that.setData({
        list: list,
        page: result.page,
        last: false,
      })
      util.hideLoading()
    })
  },
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    
    var that = this;
    util.getJSON({ apiUrl: apiurl.goods + "?page=1" + "&source=exchange" + "&keywords=" + that.data.keywords }, function (res) {
      var result = res.data.result
      var list = result.list
      that.setData({
        list: list,
        page: result.page,
        last: false,
      })
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
      util.hideLoading()
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
  link(e) {
    if (JSON.stringify(e.currentTarget.dataset.link) == "{}") {
      return 
    }
    var url = e.currentTarget.dataset.link.control
    if (JSON.stringify(e.currentTarget.dataset.link.params) != "{}") {
      for (var i in e.currentTarget.dataset.link.params) {
        console.log(i, e.currentTarget.dataset.link.params[i])
        url = url + "?" + i + "=" + e.currentTarget.dataset.link.params[i]
      }
    }
    if (e.currentTarget.dataset.children != '' && e.currentTarget.dataset.children != undefined) {
      url = url + "?children=" + JSON.stringify(e.currentTarget.dataset.children)
    }
    console.log(url)
    wx.navigateTo({
      url: url,
      fail() {
        wx.navigateTo({
          url: '../unopen/index',
        })
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})