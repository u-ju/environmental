// pages/tenantsIndex/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
var qrCodeJS = require('../../utils/qrcode.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '',
    fgColor: 'black',
    visible3:false,
    list:[0],
    is_apply:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // util.loading()
    // this.init()
  },
  init() {
    var that = this;
    util.getJSON({ apiUrl: apiurl.shop_}, function (res) {
      var result = res.data.result
      getApp().globalData.shop = result
      that.setData({
        is_apply: result.is_apply,
        apply_info: result.apply_info,
        online_list: result.shop_info.online_list,
        offline_list: result.shop_info.offline_list,
        room_list: result.apply_info.buttun_list,
        league_list: result.shop_info.league_list,
        avatar:'../../images/logozmn.jpg'
        // share_mobile: result.share_mobile
      })
      wx.hideLoading()
    })
  },
  link(){
    wx.navigateTo({
      url: '../tenantsChoice/index',
    })
    // console.log('../tenantsChoice/index?apply_info=' + JSON.stringify(this.data.apply_info) + "&room_list=" + JSON.stringify(this.data.room_list))
  },
  erwm(e){
    console.log(e)
    if (e.currentTarget.dataset.gather_qrcode){
      this.setData({
        value: e.currentTarget.dataset.gather_qrcode,
        visible3: true
      })
      qrCodeJS.qrApi.draw(this.data.value, "logoQRCode", 200, 200, null, this.data.avatar); 
    }else{
      util.alert('你还没有二维码')
    }
    
  },
  linke(e){
    console.log(e.currentTarget.dataset.status)
    if (e.currentTarget.dataset.status==1){
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    }else{
      util.alert1('该商家未通过审核')
    }
    
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
 
    wx.canvasToTempFilePath({
      canvasId: 'logoQRCode',
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
            
          }
        })
      }
    }, that)

  },
  detail(e){
    var url =''
    if (e.currentTarget.dataset.source =='offline'){
      url = '../tenants/tenants?shop_id=' + e.currentTarget.dataset.id + "&room_list=" + JSON.stringify(this.data.room_list) + "&feature_list=" + JSON.stringify(this.data.apply_info.feature_list) + "&share_mobile=" + this.data.apply_info.share_mobile
    } else if (e.currentTarget.dataset.source == 'online'){
      url = '../tenants/online?shop_id=' + e.currentTarget.dataset.id
    } else if (e.currentTarget.dataset.source == 'league') {
      url = '../tenants/league?shop_id=' + e.currentTarget.dataset.id
    }
    wx.navigateTo({
      url: url,
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
    util.loading()
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