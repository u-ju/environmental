// pages/guide/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
var qqmapsdk;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indexSize: 0,
    indicatorDots: false,
    autoplay: false,
    duration: 0, //可以控制动画
    list: '',
    list: [],
    guide_cate: [0],
    type: "",
    url1: "",
    address: '',
    erji: [],
    cate_id: 0,

    hideHeader: true,
    hideBottom: true,
    refreshTime: '', // 刷新的时间 
    loadMoreData: '加载更多……',
    indexSize1:0,
    indexSize2:0
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    
    wx.showLoading({
      title: '加载中',
    })
    this.config()
    // var guide_cate = app.globalData.config.guide_cate||''
    // that.setData({
    //   guide_cate: guide_cate,
    // })
    that.setData({
      s_height: wx.getSystemInfoSync().windowHeight - 72,
    })
  },
  config() {
    var that = this;
    util.getJSON({ apiUrl: apiurl.config }, function (res) {
      var result = res.data.result;
      getApp().globalData.config = result;
      var guide_cate = app.globalData.config.guide_cate;
      var tablen=0
      var tablen = 0
      if (guide_cate[0]["children"] && guide_cate[0]["children"][0]["children"]) {
        tablen = guide_cate[0]["children"][0]["children"].length / 3
      }
      that.setData({
        guide_cate: guide_cate,
        tablen: tablen
      })
      util.hideLoading()
    })
  },
  tab1(e){
    var guide_cate = this.data.guide_cate;
    var tablen = 0
    if (guide_cate[e.currentTarget.dataset.index]["children"]) {
      tablen = guide_cate[e.currentTarget.dataset.index]["children"].length / 3
    }
    this.setData({
      indexSize1: e.currentTarget.dataset.index,
      indexSize2:0,
      tablen: tablen
    })

  },
  // chooseerji(e){
  //   var guide_cate = this.data.guide_cate;
  //   var tablen = 0
  //   if (guide_cate[this.data.indexSize1]["children"][e.currentTarget.dataset.index]["children"]) {
  //     tablen = guide_cate[this.data.indexSize1]["children"][e.currentTarget.dataset.index]["children"].length / 3
  //   }
  //   this.setData({
  //     indexSize2: e.currentTarget.dataset.index,
  //     tablen: tablen
  //   })
  // }
})