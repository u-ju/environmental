// pages/video/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    video: [],
    videoPlay: null,
    tab:[],
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    list:[0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.hideShareMenu();
    util.loading()
    var that =this;
    that.setData({
      tab: app.globalData.config.video_cate,
      logo: app.globalData.config.logo
    });

    if (app.globalData.config.video_cate.length > 0) {
      that.init();
    } else {
      wx.hideLoading()
    }
  },
  // 点击cover播放，其它视频结束
  videoPlay: function (e) {
    var _index = e.currentTarget.dataset.id
    this.setData({
      _index: _index
    })
    //停止正在播放的视频
    var videoContextPrev = wx.createVideoContext(_index + "")
    videoContextPrev.stop();

    setTimeout(function () {
      //将点击视频进行播放
      var videoContext = wx.createVideoContext(_index + "")
      videoContext.play();
    }, 500)
  },
  like(e) {
    
      var that = this;
      util.postJSON({ apiUrl: apiurl.video_praiseStore, data: { video_id: e.currentTarget.dataset.id} }, function (res) {
        // var list = that.data.list
        // list[e.currentTarget.dataset.index].praise = 1
        // list[e.currentTarget.dataset.index].like = list[e.currentTarget.dataset.index].like - 0 + 1
        // that.setData({
        //   list: list
        // })
        var list = that.data.list
        var praise = e.currentTarget.dataset.praise
        var like = list[e.currentTarget.dataset.index].like
        if (praise == 0) {
          praise = 1
          like = like - 0 + 1
        } else {
          praise = 0
          like = like - 1
        }
        list[e.currentTarget.dataset.index].praise = praise
        list[e.currentTarget.dataset.index].like = like
        that.setData({
          list: list
        })
      })
  },
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
      // console.log(e)
      this.setData({
        currentTab: cur,
        cate_id: e.target.dataset.cate_id
      })
      this.init(e.target.dataset.cate_id)
    }
  },
  init(cate_id = this.data.tab[0].id, page = 1) {
    var that = this;
    util.getJSON({ apiUrl: apiurl.video_index + "?cate_id=" + cate_id + "&page=" + page }, function (res) {
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
    util.getJSON({ apiUrl: apiurl.list + "?cate_id=" + that.data.cate_id + "&page=1" }, function (res) {
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
      that.init(that.data.cate_id, Number(that.data.page.current_page) + 1)
    } else {
      that.setData({
        last: true
      })
      wx.hideLoading()
    }
  },
  details(e) {
    console.log(e)
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../video_detail/index?id=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    console.log(e)
    var that = this;
    return {
      title: '啄木鸟环保',
      path: '/pages/video_detail/index?id=' + e.target.dataset.id + "&pjurl='../video_detail/index?id='" + e.target.dataset.id, //这里拼接需要携带的参数
      success: function (res) {
        console.log("转发成功" + res);
      }
    }
  }
})
