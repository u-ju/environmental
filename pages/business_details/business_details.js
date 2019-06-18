// pages/business_details/business_details.js
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
    banner: [
    ],
    result: "",
    tab: ['产品', '评论', '商家信息'],
    active: 0,
    num: 0,
    minusStatus: 0,
    cur: 0,
    commentIndex: 1,
    pageN: 1
  },
  swiperChange(e) {
    let current = e.detail.current;
    // console.log(e.detail.current)
    this.setData({
      cur: current
    })
  },
  swiperC(e) {
    // console.log(e.currentTarget.dataset.index)
    this.setData({
      cur: e.currentTarget.dataset.index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var obj = wx.createSelectorQuery();
    // options.id=30
    that.setData({
      s_height: wx.getSystemInfoSync().windowHeight - 42,
    })

    if (options.id || options.t_shop_id) {
      this.setData({
        shop_id: options.id || options.t_shop_id
      })
      util.getJSON({ apiUrl: apiurl.shop_show, data: { shop_id: that.data.shop_id } }, function (res) {
        var result = res.data.result
        var comment_score = Math.ceil(result.comment_score)
        that.setData({
          result: result,
          comment_score: comment_score,
          // cur: result.video?0:1
        })
        that.getTop()
        util.hideLoading()
      })

      that.commentIndex1(that.data.shop_id)
      that.init()
    }
  },
  getTop() {
    var top = [], that = this;
    wx.createSelectorQuery().selectAll('.view0').boundingClientRect(function (rect) {

      var height = rect[0]['height']
      top.push(height)
    }).exec()
    wx.createSelectorQuery().selectAll('.view1').boundingClientRect(function (rect) {

      var height = rect[0]['height'] + top[top.length - 1]
      top.push(height)
    }).exec()
    wx.createSelectorQuery().selectAll('.view2').boundingClientRect(function (rect) {
      var height = rect[0]['height'] + top[top.length - 1]
      top.push(height)
      that.setData({
        top: top
      })
    }).exec()
  },
  init(page = 1) {
    var that = this;
    util.getJSON({ apiUrl: apiurl.goods + '?shop_id=' + that.data.shop_id + "&source=offline" + "&page=" + page + "&page_limit=" + 3 }, function (res) {

      var result = res.data.result
      var list = result.list
      that.setData({
        goods: list,
      })
      wx.hideLoading()
    })
  },
  tabswitch(e) {
    this.setData({
      active: e.currentTarget.dataset.index,
      toView: 'view' + e.currentTarget.dataset.index
    })
  },
  scroll(e) {
    var top = this.data.top, active = this.data.active;
    var scrollTop = e.detail.scrollTop + 44

    for (var i = 0; i < top.length; i++) {
      if (scrollTop < top[i]) {
        // console.log(i)
        return this.setData({
          active: i
        })
      }
    }

  },
  // 查看图片
  previewImg(e) {
    util.previewImage(e.currentTarget.dataset.src, this.data.result.images)
  },
  commentIndex1(shop_id, page = 1) {
    var that = this;
    util.getJSON({ apiUrl: apiurl.shopComment_index + shop_id + "&page=" + page + "&page_limit=" + 2 }, function (res) {
      var list = res.data.result.list
      var result = res.data.result
      that.setData({
        list: list,
        page: result.page
      })
      util.hideLoading()
    })
  },
  commentIndex(shop_id, page = 1) {
    var that = this;
    util.getJSON({ apiUrl: apiurl.shopComment_index + shop_id + "&page=" + page }, function (res) {
      var list = res.data.result.list
      var result = res.data.result
      var list1 = []
      for (var i in list) {
        list[i].created_at = list[i].created_at.split(" ")[0]
      }
      that.setData({
        list: list,
        page: result.page
      })
      util.hideLoading()
    })
  },
  more() {
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
      mask: true
    })
    if (this.data.pageN == 1) {
      this.setData({
        pageN: 0
      })
      return that.commentIndex(that.data.shop_id, 1)
    }
    // 页数+1
    if (Number(that.data.page.current_page) != Number(that.data.page.last_page)) {
      that.commentIndex(that.data.shop_id, Number(that.data.page.current_page) + 1)
    } else {
      that.setData({
        last: true
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 1000)
    }
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
  calling: function (e) {//拨打电话
    console.log(e.target.dataset.phone)
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.phone, //此号码并非真实电话号码，仅用于测试
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  location() {
    var that = this;
    var result = that.data.result;
    var data = {
      latitude: result.latitude,
      longitude: result.longitude,
      address: result.address,
      area_name: result.area_name,
    }
    // wx.navigateTo({
    //   url: '../delivery_station/index?data=' + JSON.stringify(data),
    // })
    wx.openLocation({
      latitude: Number(result.latitude),
      longitude: Number(result.longitude),
      scale: 28,
      name: result.area_name,
      address: result.address,
    })
  },
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    // wx.showNavigationBarLoading();
    // var that = this;
    // util.getJSON({ apiUrl: apiurl.shop_goodsIndex+'?shop_id=' + that.data.shop_id + "&page=1" }, function (res) {
    //   var result = res.data.result
    //   console.log(result)
    //   that.setData({
    //     list: result.list,
    //     page: result.page,
    //     last: false
    //   })
    //   // 隐藏导航栏加载框
    //   wx.hideNavigationBarLoading();
    //   // 停止下拉动作
    //   wx.stopPullDownRefresh();
    // })

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    // 显示加载图标
    // wx.showLoading({
    //   title: '玩命加载中',
    // })
    // // 页数+1
    // if (Number(that.data.page.current_page) != Number(that.data.page.last_page)) {
    //   that.init(Number(that.data.page.current_page) + 1)
    // } else {
    //   that.setData({
    //     last: true
    //   })
    //   wx.hideLoading()
    // }
  },
  detail(e) {
    wx.navigateTo({
      url: '../businessProduct/index?id=' + this.data.shop_id + "&sku_id=" + e.currentTarget.dataset.sku_id,
    })

  },
  //事件处理函数
  /*点击减号*/
  bindMinus: function () {
    var num = this.data.num;
    if (num > 0) {
      num--;
    }
    var minusStatus = num > 0 ? 1 : 0;
    this.setData({
      num: num,
      minusStatus: minusStatus
    })
  },
  /*点击加号*/
  bindPlus: function () {
    var num = this.data.num;
    num++;
    console.log(num)
    var minusStatus = num > 0 ? 1 : 0;
    this.setData({
      num: num,
      minusStatus: minusStatus
    })
  },
  /*输入框事件*/
  bindManual: function (e) {
    var num = e.detail.value;
    var minusStatus = num > 0 ? 1 : 0;
    this.setData({
      num: num,
      minusStatus: minusStatus
    })
  },
  license() {
    wx.navigateTo({
      url: 'license/index?license_info=' + JSON.stringify(this.data.result.license_info) + "&license=" + this.data.result.license,
    })
  },
  reservation() {
    wx.navigateTo({
      url: 'reservation/index?reservation=' + JSON.stringify(this.data.result.reservation),
    })
  },
  goods(e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../installment_details/installment_details?id=' + e.currentTarget.dataset.id,
    })
  },
  moregoods(){
    wx.navigateTo({
      url: 'product/index?id=' + this.data.shop_id,
    })
  },
  collect(e) {
    var that = this;
    util.postJSON({
      apiUrl: apiurl.collectUpdate,
      data: { source: e.currentTarget.dataset.source, source_id: e.currentTarget.dataset.id }
    }, function (res) {
      var result = that.data.result
      var mes=result.is_collect == 1?"取消收藏成功":'收藏成功'
      util.alert1(mes)
      result.is_collect = result.is_collect == 1 ? 0 : 1
      that.setData({
        result: result
      })
    })
  },
  onShareAppMessage: function () {
    var pjdata ={
      id: this.data.shop_id
    }
    return util.share('啄木鸟环保', '../business_details/business_details&pjdata=' + JSON.stringify(pjdata) )
  }
})