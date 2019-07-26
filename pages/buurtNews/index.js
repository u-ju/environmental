// pages/buurtNews/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
var WxParse = require('../../wxParse/wxParse.js');
var template = require('../../Components/tab-bar/tab-bar.js');
Page({
  data: {
    
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    expertList: [

    ],
    topNum: 0,
    news: [0],
    page: {},
    length: 0,
    cate_id: 0,
    tabbarid: 0,
    result:[0],
    tab: [
      { name: '社区简介', url: 'about' },
      { name: '社区公告', url: 'notice' },
      { name: '社区资讯', url: 'index' },
      { name: '社区服务', url: 'service' },
    ],
    result1:1
  },
  like(e) {
    // if (!e.currentTarget.dataset.praise){
    var that = this;
    util.postJSON({ apiUrl: apiurl.buurtNews.praiseStore, data: { news_id: e.currentTarget.dataset.id } }, function (res) {
      var news = that.data.news
      var praise = e.currentTarget.dataset.praise
      var like = news[e.currentTarget.dataset.index].like
      if (praise == 0) {
        praise = 1
        like = like - 0 + 1
      } else {
        praise = 0
        like = like - 1
      }
      news[e.currentTarget.dataset.index].praise = praise
      news[e.currentTarget.dataset.index].like = like
      that.setData({
        news: news
      })
    })
  },
  _addEvent() {
    this.setData({
      topNum: 0,
    });
  },
  onReady() {
    template.tabbar("tabBar", 0, this)
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur,
        news:[0]
      })
      this.init()
      wx.setNavigationBarTitle({
        title: this.data.tab[cur]["name"],
      })
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {

  },
  onLoad: function () {
    var that = this;
    util.loading()
    wx.setNavigationBarTitle({
      title: this.data.tab[0]["name"],
    })
    that.init()
  },
  init(page = 1) {
    var that = this;
    util.getJSON({ apiUrl: apiurl.buurtNews[this.data.tab[this.data.currentTab]['url']]+'?page='+page}, function (res) {
      var result = res.data.result
      if (that.data.currentTab==0){
        if (res.data.result.content_source == "html") {
          var article = res.data.result.content;
          WxParse.wxParse('article', 'html', article, that, 5);
        }
        util.hideLoading()
        return that.setData({
          result: result,
          result1: util.isempty(result)
        })
      }
      var list = result.list
      if (page != 1) {
        list = that.data.news.concat(list)
      }
      that.setData({
        news: list,
        page: result.page||'',
        last: false,
        length: Math.ceil(list.length / 4)
      })
      util.hideLoading()
    },function(res){
      if (that.data.currentTab == 0) {
        
        return that.setData({
          result1: util.isempty(res.data.result)
        })
      }
    })
  },
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    util.getJSON({ apiUrl: apiurl.buurtNews.index + "&page=1" }, function (res) {
      var result = res.data.result
      that.setData({
        news: result.list,
        page: result.page,
        last: false,
        length: Math.ceil(list.length / 4)
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
    if (!that.data.page){
      return
    }
    if (Number(that.data.page.current_page) != Number(that.data.page.last_page)) {
      that.init(that.data.cate_id, Number(that.data.page.current_page) + 1)
    } else {
      that.setData({
        last: true
      })
      wx.hideLoading()
    }
  },
  details(e) {

    wx.navigateTo({
      url: e.currentTarget.dataset.url+'?id=' + e.currentTarget.dataset.id,
    })
  },
  show() {
    util.scan()
  },
  tabarUrl(e) {
    console.log(e);
    if (this.data.tabbarid != e.currentTarget.dataset.id) {
      wx.redirectTo({
        url: e.currentTarget.dataset.url,
      })
    }
  }
})