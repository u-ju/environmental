// pages/businessProduct/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,//显示面板指示点
    autoplay: true,//自动播放
    beforeColor: "white",//指示点颜色
    afterColor: "coral",//当前选中的指示点颜色
    interval: 5000,
    duration: 1000,
    banner: [
      'https://wyhb-res-pr.zgwyhb.com/uploads/image/2019/03/29/2394b94632b9a7a1e9aa0b397f5ce2c3.jpg',
      'https://wyhb-res-pr.zgwyhb.com/uploads/image/2019/03/29/2394b94632b9a7a1e9aa0b397f5ce2c3.jpg',
      'https://wyhb-res-pr.zgwyhb.com/uploads/image/2019/03/29/2394b94632b9a7a1e9aa0b397f5ce2c3.jpg'
    ],
    visible2:false,
    item:[0,1,2,3,4,5,6,7],
    current:0,
    num: 1,
    minusStatus: 'disable'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    util.loading()
    if (options.sku_id) {
      this.setData({
        sku_id: options.sku_id,
      })
      util.getJSON({ apiUrl: apiurl.shop_goodsShow + that.data.sku_id }, function (res) {

        var result = res.data.result
        that.setData({
          result: result,
          date_options: result.date_options
        })
        wx.hideLoading()
      })
    }
  },
  contact: function (e) {//拨打电话
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.contact, //此号码并非真实电话号码，仅用于测试
      success: function () {
        console.log("拨打电话成功！")

      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  detail(e){
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../business_details/business_details?t_shop_id=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  open2() {
    this.setData({
      visible2: true,
    })
  },
  close2() {
    this.setData({
      visible2: false,
    })
  },
  onClose(key) {
    console.log('onClose')
    this.setData({
      [key]: false,
    })
  },
  onClose2() {
    this.onClose('visible2')
  },
  prevImg: function () {
    var item = this.data.item;
    var current = this.data.current;
    current = current > 0 ? current - 1 : 0;
    this.setData({
      current: current,
    })
  },

  nextImg: function () {
    var item = this.data.item;
    var current = this.data.current;
    current = current < (item.length - 1) ? current + 1 : item.length - 1;
    this.setData({
      current: current,
    })
  },
  choosecurrent(e){
    this.setData({
      current: e.currentTarget.dataset.index,
    })
  },
  //事件处理函数
  /*点击减号*/
  bindMinus: function () {
    var num = this.data.num;
    if (num > 1) {
      num--;
    }
    var minusStatus = num > 1 ? 'normal' : 'disable';
    this.setData({
      num: num,
      minusStatus: minusStatus
    })
  },
  /*点击加号*/
  bindPlus: function () {
    var num = this.data.num;
    num++;
    var minusStatus = num > 1 ? 'normal' : 'disable';
    this.setData({
      num: num,
      minusStatus: minusStatus
    })
  },
  /*输入框事件*/
  bindManual: function (e) {
    var num = e.detail.value;
    var minusStatus = num > 1 ? 'normal' : 'disable';
    this.setData({
      num: num,
      minusStatus: minusStatus
    })
  }
})