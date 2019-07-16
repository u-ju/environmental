// pages/ecofer/ecofer.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
var qrCodeJS = require('../../utils/qrcode.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: [
      { id: 1, name: "环保金兑换" },
      { id: 2, name: "兑换记录" },
    ],
    currentData: 0,
    showmodel: false,
    money:'',
    price:'',
    key:'',
    images: ['../../images/big@2x.png','../../images/small@2x.png'],
    disabled:true,
    value: '',
    fgColor: 'black',
    ewmshow:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // util.getJSON({ apiUrl: apiurl }, function (res) {
    var eco_bag_type = app.globalData.config.eco_bag_type;
    for (var key in eco_bag_type){
      eco_bag_type[key]["images"]=this.data.images[key]
    }
    this.setData({
      eco_bag_type: eco_bag_type
    })
    wx.hideLoading()
    // })
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
  init1(page = 1) {
    var that = this;
    util.getJSON({ apiUrl: apiurl.ecoBag_exchangeIndex + "?page=" + page }, function (res) {
      var result = res.data.result
      console.log(result)
      var list = result.list
      if (page != 1) {
        list = that.data.list.concat(list)
      }
      that.setData({
        list: list,
        page: result.page,
        last: false,
        ewmshow:false
      })
      util.hideLoading()
    })
  },
  formSubmit(e) {
    console.log(e)
    var data = e.detail.value;
    var that =this;
    data['bag_type']=this.data.key
    this.setData({
      disabled:true
    })
    util.postJSON({ apiUrl: apiurl.ecoBag_exchange, data: data }, function (res) {
      var result = res.data.result
      that.setData({
        value: result.qrcode,
        ewmshow:false
      })
    })
  },
  previewImage() {
    // 在自定义组件下，当前组件实例的 this，以操作组件内 <canvas> 组件
    var that = this;
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
      if (e.target.dataset.current == 0) {
        that.init1()
      }
      that.setData({
        currentData: e.target.dataset.current,
      })
    }
  },
  model(e) {
    var price = 0
    if (e.currentTarget.dataset.price){
      console.log(e.currentTarget.dataset.price)
      price = e.currentTarget.dataset.price
    }
    this.setData({
      showmodel: !this.data.showmodel,
      money: '',
      price: price,
      key: e.currentTarget.dataset.key,
      ewmshow:true
    })
  },
  shuliang(e){
    console.log(e.detail.value)
    var disabled = true
    if (e.detail.value) {
      disabled = false
    }
    this.setData({
      money: (e.detail.value - 0) * this.data.price,
      disabled: disabled
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
    util.getJSON({ apiUrl: apiurl.ecoBag_exchangeIndex, data: { page: 1 } }, function (res) {
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