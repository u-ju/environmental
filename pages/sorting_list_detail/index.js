// pages/sorting_all/sorting_all.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: 0,
    windowHeight: 0,
    pay: false,
    tag_key: '',
    tab: [],
    bag_order_arr: [],
    bag_stat: [],
    payment: '',
    // is_password: '',
    result1: {},
    visible2: false,
    qrcode: '',
    order_id: '',
    showmodel: false,
    value: '',
    fgColor: 'black',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        that.setData({
          windowWidth: res.windowHeight,
          windowHeight: res.windowWidth,
        })
      }
    })
    that.init()
    // util.getJSON({ apiUrl: apiurl.config }, function (res) {
    //   var result = res.data.result;
    //   that.setData({
    //     tab: result.garbage_cate,
    //     casArray: result.onsite_recycle_order_type
    //   })
    // })
    that.setData({
      tab: app.globalData.config.garbage_cate,
      casArray: app.globalData.config.onsite_recycle_order_type
    })
    if (options.order_id) {
      
      that.init(options.order_id)
    }
  },
  init(order_id) {
    var that = this;
    util.getJSON({
      apiUrl: apiurl.stationOrderShow + '?order_id=' + order_id
    }, function (res) {
      var result = res.data.result;
      var bag_stat = result.bag_stat;
      var details = result.details
      for (var i in details) {
        details[i]["xiala"] = false
        details[i]["ids"] = i
      }
      that.setData({
        bag_order_arr: result.bag_order_arr,
        bag_stat: bag_stat,
        // tag_key: result.tag_key,
        order_id: result.order_id,
        value: result.pay_qrcode,
        details: result.details
      })
      wx.hideLoading()
    })
  },

  xiala(e) {
    console.log(e)
    this.setData({
      ['details[' + e.currentTarget.dataset.index + '].xiala']: !this.data.details[e.currentTarget.dataset.index].xiala
    })
  },
  select(e) {
    this.setData({
      ['details[' + e.currentTarget.dataset.ids + '].garbage_cate_id']: e.currentTarget.dataset.id,
      ['details[' + e.currentTarget.dataset.ids + '].garbage_cate_name']: e.currentTarget.dataset.name,
      ['details[' + e.currentTarget.dataset.ids + '].price']: e.currentTarget.dataset.price,
      ['details[' + e.currentTarget.dataset.ids + '].xiala']: false,
    })
  },
  input(e) {
    this.setData({
      ['details[' + e.currentTarget.dataset.index + '].price']: e.detail.value,
    })
  },
  pay_true() {
    var data = {
      order_id: this.data.order_id
    }, that = this;
    for (var key in this.data.details) {
      data['detail[' + key + '][garbage_cate_id]'] = this.data.details[key].garbage_cate_id;
      data['detail[' + key + '][price]'] = this.data.details[key].price
    }
    util.postJSON({ apiUrl: apiurl.stationOrderUpdate, data: data }, function (res) {
      var result = res.data.result
      that.setData({
        pay: true,
      })
      util.alert(res.data.message)
    })
  },
  // pay(){

  // },
  
  model(e) {
    this.setData({
      showmodel: !this.data.showmodel,
    })
  },
  open2() {
    this.setData({
      showmodel: true,
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