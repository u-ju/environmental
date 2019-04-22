// pages/tenantsIndex/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '',
    fgColor: 'black',
    visible3:false,
    list:[0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.loading()
    this.init()
  },
  init() {
    var that = this;
    util.getJSON({apiUrl: apiurl.shopSettled}, function (res) {
      var result = res.data.result
      var list = result.list
      that.setData({
        list: list
      })
      wx.hideLoading()
    })
  },
  link(){
    wx.navigateTo({
      url: '../tenants/tenants',
    })
  },
  erwm(e){
    console.log(e)
    if (e.currentTarget.dataset.gather_qrcode){
      this.setData({
        value: e.currentTarget.dataset.gather_qrcode,
        visible3: true
      })
    }else{
      util.alert('你还没有二维码')
    }
    
  },
  linke(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  open3(e) {
    this.setData({
      visible3: true,
      value: e.currentTarget.dataset.invite
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
  model(){
    this.setData({
      showmodel: !this.data.showmodel
    })
  },
  previewImage() {
    
    // 在自定义组件下，当前组件实例的 this，以操作组件内 <canvas> 组件
    const that = this.selectComponent('#qrcode')
    console.log("huhu")
    wx.canvasToTempFilePath({
      canvasId: 'wux-qrcode',
      success: (res1) => {
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
  detail(e){
    wx.navigateTo({
      url: '../tenants/tenants?shop_id=' + e.currentTarget.dataset.id,
    })
  },
  randomColor() {
    const colorStr = Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase()
    const length = colorStr.length
    const prefixStr = `000000`.substring(0, 6 - colorStr.length)
    return `#${prefixStr}${colorStr}`
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