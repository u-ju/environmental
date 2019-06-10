// pages/family/associated/index.js
const app = getApp()
var util = require('../../../utils/util.js');
var apiurl = require('../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visible1: false,
    list1:[],
    list:[0],
    current:0
  },
  open1() {
    this.setData({
      visible1: true,
    })
  },
  close1() {
    this.setData({
      visible1: false,
    })
  },
  init() {
    this.setData({
      list: [0]
    })
    var that = this;
    var url = this.data.current == 0 ? 'familyIndex' :'familyApplyIndex'
    util.getJSON({ apiUrl: apiurl[url] }, function (res) {
      var result = res.data.result
      util.hideLoading()
      that.setData({
        list: result.list,
        user_role: result.user_role||''
      })
    })
  },
  // init1() {
  //   var that = this;
  //   util.getJSON({ apiUrl: apiurl.familyApplyIndex }, function (res) {
  //     var result = res.data.result
  //     util.hideLoading()
  //     that.setData({
  //       list1: result.list
  //     })
  //   })
  // },
  refuseApply(e){
    var that = this;
    util.loading()
    util.postJSON({ apiUrl: apiurl.familyRefuseApply, data: { id: e.currentTarget.dataset.id } }, function (res) {
      util.alert(res.data.message, 800)
      that.init()
    })
  },
  agreeApply(e) {
    var that = this;
    util.loading()
    util.postJSON({ apiUrl: apiurl.familyAgreeApply, data: { id: e.currentTarget.dataset.id } }, function (res) {
      util.alert(res.data.message, 800)
      that.init()
    })
  },
  tabcur(e){
    var that = this;
    if (this.data.current== e.currentTarget.dataset.cur){
      return
    }
    this.setData({
      current: e.currentTarget.dataset.cur 
    },function(){
      that.init()
    })
  },
  unbind(e){
    this.setData({
      visible1:true,
      user_id: e.currentTarget.dataset.user_id
    })
  },
  unbinds(){
    var that = this;
    util.loading()
    util.popoutc('对方同意申请后，环保积分和环保金 将被共享。', '拒绝', '#444444', '同意', '#4FD6F0', function () {
      that.setData({
        visible1: false,
      })
    }, function () {
      util.postJSON({ apiUrl: apiurl.familyUnbind, data: { user_id: this.data.user_id } }, function (res) {
        util.alert(res.data.message, 800)
        that.setData({
          visible1: false,
        })
        that.init()
      })
    })
    
  },
  kicking(e){
    var that = this;
    util.popoutc('是否确定踢出该成员？', '否', '#444444', '是', '#4FD6F0',function(){
      console.log("取消")
    },function(){
      util.postJSON({ apiUrl: apiurl.familyKicking, data: { id: e.currentTarget.dataset.id} }, function (res) {
        util.alert1(res.data.message)
        that.init()
      })
    })
  },
  transferOwner(e){
    var that = this;
    util.popoutc('是否确定转让群主？', '否', '#444444', '是', '#4FD6F0', function () {
      console.log("取消")
    }, function () {
      util.postJSON({ apiUrl: apiurl.familyTransferOwner, data: { id: e.currentTarget.dataset.id } }, function (res) {
        util.alert1(res.data.message)
        that.init()
      })
    })
  },
  quit(){
    var that = this;
    util.popoutc('是否确定退出家庭', '否', '#444444', '是', '#4FD6F0', function () {
      console.log("取消")
    }, function () {
      util.postJSON({ apiUrl: apiurl.familyQuit }, function (res) {
        util.alert1(res.data.message)
        that.init()
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
    // this.init1()
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