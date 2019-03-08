// pages/application_bag/application_bag.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: [
      { id: 1, name: "申请环保袋" },
      { id: 2, name: "申请记录" },
    ],
    currentData: 0,
    page:{},
    list:[],
    disabled:true,
    form:{
      big_count:'',
      small_count:''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideLoading()
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
  input(e){
    var disabled = true;
   
    this.setData({
      ["form." + e.currentTarget.dataset.name]: e.detail.value
    })
    console.log(this.data.form.big_count)
    console.log(this.data.form.small_count)
    console.log(this.data.disabled)
    if (this.data.form.big_count || this.data.form.small_count){
      console.log(this.data.form[e.currentTarget.dataset.name])
      disabled= false
    }
    this.setData({
      disabled: disabled
    })
    
  },
  bindchange: function (e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })
  },
  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    console.log(e.target.dataset.current)
    const that = this;
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      if (e.target.dataset.current == 1) {
        that.init1()
      }
      that.setData({
        currentData: e.target.dataset.current,
      })
    }
  },
  init1(page=1){
    var that = this;
    util.getJSON({ apiUrl: apiurl.ecoBag_applyIndex + "?page=" + page }, function (res) {
      var result = res.data.result
      console.log(result)
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
  formSubmit(e){
    console.log(e)
    var data = e.detail.value
    this.setData({
      disabled: true
    })
    util.postJSON({ apiUrl: apiurl.ecoBag_apply, data: data }, function (res) {
      var result = res.data.result
      util.alert(res.data.message)
      // wx.navigateTo({
      //   url: '',
      // })
    })
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
    util.getJSON({ apiUrl: apiurl.ecoBag_applyIndex, data: { page: 1 } }, function (res) {
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
      that.init( Number(that.data.page.current_page) + 1)
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