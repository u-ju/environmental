// pages/about/about.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: [
      // {
      //   "id": "1",
      //   "name": "公司介绍"
      // },
      // {
      //   "id": "2",
      //   "name": "联系我们"
      // },
    ],
    currentData: 1,
    // 中心点纬度、经度
    latitude: "",
    longitude: "",
    // 标记点 当前位置
    markers: [],
    // 圆
    circles: [],
    // 控件 回到当前位置
    controls: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideLoading();
    this.setData({
      official_qr: app.globalData.config.official_qr,
      longitude: app.globalData.config.company_location.longitude,
      latitude: app.globalData.config.company_location.latitude,
      address: app.globalData.config.company_location.address,
      phone: app.globalData.config.company_location.phone,
      markers: [
        {
          id: 1,
          latitude: app.globalData.config.company_location.latitude,
          longitude: app.globalData.config.company_location.longitude,
          name: app.globalData.config.company_location.address,
          iconPath: '../../images/dingwei.png',
          width:20,
          height:20
        },]
    })
    var mapCtx = wx.createMapContext('#map')
    var latitude = app.globalData.config.company_location.latitude, longitude = app.globalData.config.company_location.longitude;
    mapCtx.getCenterLocation({
      success: function (res) {
        latitude = res.latitude;
        longitude = res.longitude;
      }
    }) 
    //获取当前地图的中心经纬度
    mapCtx.includePoints({
      padding: [10],
      points: [{
        latitude: latitude ,
        longitude: longitude
      }]
    })
    console.log(latitude, longitude)
    mapCtx.translateMarker({
      markerId: 0,
      autoRotate: true,
      duration: 1000,
      destination: {
        latitude: latitude,
        longitude: longitude,
      },
      animationEnd() {
        console.log('animation end')
      }
    })
  },
  markertap(){
    var that = this
    wx.openLocation({
      latitude: Number(that.data.latitude),
      longitude: Number(that.data.longitude),
      scale: 28,
      name: that.data.address,
      address: that.data.address,
    })
  },
  regionchange(e) {
    // console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
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
  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    const that = this;
    console.log(e.target.dataset.current)
      that.setData({
        currentData: e.target.dataset.current
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