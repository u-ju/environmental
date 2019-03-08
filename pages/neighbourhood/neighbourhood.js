// pages/neighbourhood/neighbourhood.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({
  data: {
    tab: [],
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    
    topNum: 0,
    news: [],
    page: {},
    length: 0,
    tab:[
      {name: '全部', id: '', value:'',},
      {name: '最新', id: 'sort', value: 'new',},
      {name: '精选', id: 'order', value: 'asc',}
    ],
    url:''
  },

  // _addEvent() {
  //   this.setData({
  //     topNum: 0,
  //   });
  // },
  onReady() {
    // template.tabbar("tabBar", 0, this)
  },
  
  
  onLoad: function () {
    var that = this;
    util.loading()

    that.init()
    wx.hideLoading()
  },
  init(page = 1,url='') {
    //  
    var that = this;
    util.getJSON({ apiUrl: apiurl.vicinage + "?page=" + page+url}, function (res) {
      var result = res.data.result
      var list = result.list
      for(var i in list){
        list[i]["created_at"] = list[i]["created_at"].split(" ")[0]
      }
      if (page != 1) {
        list = that.data.news.concat(list)
      }
    
      that.setData({
        news: list,
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
    util.getJSON({ apiUrl: apiurl.vicinage + "?page=1" + that.data.url }, function (res) {
      var result = res.data.result
      var list = result.list
      for (var i in list) {
        list[i]["created_at"] = list[i]["created_at"].split(" ")[0]
      }
      if (page != 1) {
        list = that.data.news.concat(list)
      }

      that.setData({
        news: list,
        page: result.page,
        last: false,
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
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    console.log(e)
    if (this.data.currentTaB == cur) {
      return false;
    } else {
      var url = '';
      if (e.currentTarget.dataset.id){
        url = "&" + e.currentTarget.dataset.id + "=" + e.currentTarget.dataset.value
      }
      this.setData({
        currentTab: cur,
        url: url
      })
      this.init(1, url)
    }
  },
  onReachBottom: function () {
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    // 页数+1
    if (Number(that.data.page.current_page) != Number(that.data.page.last_page)) {
      // 
      that.init(Number(that.data.page.current_page) + 1, that.data.url)
    } else {
      that.setData({
        last: true
      })
      wx.hideLoading()
    }
  },
  details(e) {
    // console.log(e)
    // console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../neighbourhood_detail/neighbourhood_detail?id=' + e.currentTarget.dataset.id,
    })
  },
  like(e) {
    
      var that = this;
      util.postJSON({ apiUrl: apiurl.vicinage_praiseStore, data: { vicinage_id: e.currentTarget.dataset.vicinage_id } }, function (res) {
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
  onShareAppMessage: function (res) {
    this.setData({
      share_zzc: !this.data.share_zzc
    })
    return {
      title: '奥特利环保',
      path: '/pages/neighbourhood_detail/neighbourhood_detail?id=' + this.data.vicinage_id + "&pjurl='../neighbourhood_detail/neighbourhood_detail?id='" + this.data.vicinage_id,
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: "分享成功",
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        // 分享失败
      },
    }
  },
})
