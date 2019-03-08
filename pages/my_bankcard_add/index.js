// pages/my_bankcard_add/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: 1, value: '同意' },
    ],
    choose:[],
    disabled:false
  },

  checkboxChange(e) {
    this.setData({
      choose:e.detail.value
    })
  },
  formSubmit(e){
    
    if (this.data.choose.length<1){
      return util.alert("请勾选用户协议")

    }
    console.log(e.detail.value.card_no)
    var data = e.detail.value,that = this;
    that.setData({
      disabled: true
    })
    util.postJSON({ apiUrl: apiurl.bankCard_store, data: data },
      function (res) {
        var result = res.data.result;
        wx.showToast({
          icon: 'ios-checkbox-outline',
          title: '添加成功'
        })
        util.deplay_navigateTo("../my_bankcard/index")
      }, function () {
        that.setData({
          disabled: false
        })
      }, function () {
        that.setData({
          disabled: false
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