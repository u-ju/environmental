// pages/agent/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visible2:false,
    visible1: false,
    visible3: false,
    payment_usable: [
      { image: "../../images/gold.png", text: '余额支付', checked: 'true' },
      { image: "../../images/weixin@2x.png", text: '环保金支付', checked: '' }
    ],
    value: 'hhh',
    fgColor: 'black',
    is_agent:6,
    items: [
      { name: 1, value: '同意', checked: true },
    ],
    choose: ['1'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      agentxy: app.globalData.config.protocol.agent
    })
  },
  init() {
    var that = this;
    util.getJSON({ apiUrl: apiurl.agent }, function (res) {
      var result= res.data.result
      that.setData({
        is_agent: 1,
        list: result.list
      })
      var article = res.data.result.explain;
      WxParse.wxParse('article', 'html', article, that, 5);
      wx.hideLoading()
    })
  },
  radioChange: function (e) {//入驻类型选择
    this.setData({
      payment: e.detail.value
    })
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  checkboxChange(e) {
    console.log(e.detail.value)
    this.setData({
      choose: e.detail.value
    })
  },
  sharerSet() {
    this.setData({
      visible1: true,
    })
  },
  close1() {
    this.setData({
      visible1: false,
    })
  },
  onClose1() {
    // this.onClose('visible1')
    this.setData({
      visible1: false,
    })
  },
  onClosed1() {
    // this.onClose('visible1')
    this.setData({
      visible1: false,
    })
  },
  open3(e) {
    console.log(e.currentTarget.dataset.invite)
    // if (e.currentTarget.dataset.invite==''){
    //   return false
    // }
    this.setData({
      visible3: true,
      value: e.currentTarget.dataset.invite
    })
    
  },
  onClose2(){
    this.setData({
      visible2: false,
    })
  },
  close3() {
    this.setData({
      visible3: false,
    })
  },
  onClose3() {
    // this.onClose('visible1')
    this.setData({
      visible3: false,
    })
  },
  formSubmit: function (e) {
    var that = this;
    util.postJSON({ apiUrl: apiurl.agent_sharerSet, data: { agent_id: e.detail.value.agent_id, share_mobile: e.detail.value.share_mobile } },
      function (res) {
        var result = res.data.result
        console.log(result)
        that.init()
      })
  },
  agentPay(){
    if (this.data.choose.length < 1) {
      return util.alert("请勾选环保履约协议")

    }
    wx.navigateTo({
      url: '../agentPay/index',
    })
  },
  previewImage() {
    // 在自定义组件下，当前组件实例的 this，以操作组件内 <canvas> 组件
    const that = this.selectComponent('#qrcode')
    console.log("huhu")
    wx.canvasToTempFilePath({
      canvasId: 'wux-qrcode',
      success: (res1) => {
        // wx.previewImage({
        //   urls: [res.tempFilePath]
        // })
        wx.showModal({
          title: '保存图片',
          content: '确定要保存二维码？',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {
              wx.saveImageToPhotosAlbum({
                filePath: res1.tempFilePath,
                success(res) {
                  util.alert("保存成功")
                }
              })
            }
          }, fail: function (res) {
            console.log(11111)
          }
        })
      }
    }, that)
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
    this.init()
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