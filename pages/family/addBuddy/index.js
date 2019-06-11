// pages/family/addBuddy/index.js
const app = getApp()
var util = require('../../../utils/util.js');
var apiurl = require('../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    search:'',
    list:[]
  },
  search(e) {
    this.setData({
      search: e.detail.value
    })
    
  },
  testcall(e) {
    util.testjq(e.detail.value, "请输入正确的联系方式", function () {
      
    })
  },
  searchSubmit() {
    // console.log(this.data.search)
    util.loading()
    this.init(this.data.search)
  },
  init(keywords = '') {
    var that = this;
    util.getJSON({ apiUrl: apiurl.userSearch + keywords }, function (res) {
      var result = res.data.result
      util.hideLoading()
      that.setData({
        list: result.list
      })
    })
  },
  send(e){
    // util.loading()
    var that = this;
    util.popoutc('对方同意申请后，环保积分和环保金 将被共享。', '拒绝', '#444444', '同意', '#4FD6F0', function () {
      console.log("取消")
    }, function () {
      util.postJSON({ apiUrl: apiurl.familySendApply, data: { mobile: e.currentTarget.dataset.mobile } }, function (res) {
        util.alert(res.data.message)
        util.navigateBack()
      })
    })
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})