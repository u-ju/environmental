// pages/business_details/viewcomments/index.js
const app = getApp()
var util = require('../../../utils/util.js');
var apiurl = require('../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allchooseid:[],
    chooseid:[],
    all:0,
    list:[0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      shop_id: options.id
    })
    this.commentIndex1(options.id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  commentIndex1(shop_id, page = 1) {
    var that = this;
    util.getJSON({ apiUrl: apiurl.shopComment_index + shop_id + "&page=" + page  }, function (res) {
      var list = res.data.result.list
      var result = res.data.result
      if (page != 1) {
        list = that.data.list.concat(list)
      }
      var allchooseid=[]
      for(var i in list){
        allchooseid.push(list[i]["id"])
      }
      that.setData({
        list: list,
        page: result.page,
        allchooseid: allchooseid
      })
      util.hideLoading()
    })
  },
  allchoose(e) {
    var all = this.data.all, list = this.data.list, allchooseid= [],chooseid=[]
    if (!this.data.all) {
      allchooseid = this.data.allchooseid
      for (var i in list) {
        chooseid.push(list[i]["id"])
      }
    }
    this.setData({
      chooseid: chooseid,
      all: !all
    })
  },
  chooseid(e){
    var id = e.currentTarget.dataset.id
    var chooseid = this.data.chooseid
    var allchooseid = this.data.allchooseid, all = 1
    if (chooseid.indexOf(id)>-1){
      
      chooseid.splice(chooseid.indexOf(id), 1)
    }else{
      chooseid.push(id)
    }
    if (chooseid.length != allchooseid.length) {
      all = 0
    }
    this.setData({
      chooseid: chooseid,
      all: all
    })
  },
  choosedel(){
    var that = this;
    var data = {}, chooseid = this.data.chooseid
    for (var i in chooseid) {
      data['id[' + i + ']'] = chooseid[i]
    }
    console.log(data)
    util.postJSON({ apiUrl: apiurl.shopComment_delShop, data: data }, function (res) {
      util.alert(res.data.message)
      that.goodsCart()
    })
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
 // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    util.getJSON({ apiUrl: apiurl.shop_goodsIndex+'?shop_id=' + that.data.shop_id + "&page=1" }, function (res) {
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})