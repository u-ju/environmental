// pages/my_release/index.js
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
    tab: [
      { name: '全部', id: '', value: '', },
      { name: '最新', id: 'sort', value: 'new', },
      { name: '精选', id: 'order', value: 'asc', }
    ],
    url: '',
    nickname:'',
    avatar:''
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
  init(page = 1) {
    //  
    var that = this;
    util.getJSON({ apiUrl: apiurl.vicinage_userIndex + "?page=" + page  }, function (res) {
      var result = res.data.result
      var avatar = '', nickname = ''
      var list = result.list
      if(list.length>0){
        avatar = list[0].avatar
        nickname = list[0].nickname
      }else{
        avatar = app.globalData.userInfo.avatar
        nickname = app.globalData.userInfo.nickname
      }
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
        avatar: avatar,
        nickname: nickname
      })
      util.hideLoading()
    })
  },
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    util.getJSON({ apiUrl: apiurl.vicinage + "?page=1" }, function (res) {
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
  
  onReachBottom: function () {
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    // 页数+1
    if (Number(that.data.page.current_page) != Number(that.data.page.last_page)) {
      // 
      that.init(Number(that.data.page.current_page) + 1)
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
      url: '../neighbourhood_detail/neighbourhood_detail?vicinage_id=' + e.currentTarget.dataset.id,
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
    var pjdata = {
      id: this.data.vicinage_id
    }
    return util.share('啄木鸟环保', '../neighbourhood_detail/neighbourhood_detail&pjdata=' + JSON.stringify(pjdata))
    // return {
    //   title: '啄木鸟环保',
    //   path: '/pages/neighbourhood_detail/neighbourhood_detail?id=' + this.data.vicinage_id + "&pjurl='../neighbourhood_detail/neighbourhood_detail?id='" + this.data.vicinage_id,
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
  delete(e){
    var that = this;
    wx.showModal({
      title: '提醒',
      content: '是否确定删除？',
      cancelText: '否',
      cancelColor: '#2EB354',
      confirmText: '是',
      confirmColor: '#444444',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          var that = this;
          util.postJSON({ apiUrl: apiurl.vicinage_userDestroy, data: { vicinage_id: e.currentTarget.dataset.vicinage_id } }, function (res) {
            that.init()
          })
        } else {
          console.log('用户点击取消')
        }

      }
    })
  },
  edit(e){
    wx.navigateTo({
      url: '../neighbourhood_release/index?vicinage_id=' + e.currentTarget.dataset.vicinage_id,
    })
  }
})
