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
    pay:false,
    tag_key:'',
    tab:[],
    bag_order_arr:[],
    bag_stat:[],
    payment: '',
    is_password: '',
    // payment_usable: [
    //   { image: "../../images/gold.png", text: '余额支付', checked: 'true' },
    //   { image: "../../images/weixin@2x.png", text: '环保金支付', checked: '' }
    // ],
    result1: {},
    visible2: false,
    qrcode: '',
    order_id:'',
    showmodel:false,
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
    if (options.bag){
      var bag = JSON.parse(options.bag), data = '';
      for (var key in bag) {
        data = data + key + "=" + bag[key] + "&"
      }
      data = data.substring(0, data.length - 1)
      that.init(data)
    }
  },
  init(bag) {
    var that = this;
    util.getJSON({
      apiUrl: apiurl.stationOrderPreview + '?'+bag
    }, function (res) {
      var result = res.data.result;
      var bag_stat = result.bag_stat
      for (var i in bag_stat.garbage_cate){
        bag_stat.garbage_cate[i]["xiala"]=false
        bag_stat.garbage_cate[i]["ids"]=i
      }
      that.setData({
        bag_order_arr: result.bag_order_arr,
        bag_stat: bag_stat,
        tag_key: result.tag_key,
        order_id: result.bag_order_arr[0].order_id
      })
      wx.hideLoading()
    })
  },
  
  xiala(e) {
    console.log(e)
    this.setData({
      ['bag_stat.garbage_cate[' + e.currentTarget.dataset.index + '].xiala']: !this.data.bag_stat.garbage_cate[e.currentTarget.dataset.index].xiala
    })
  },
  select(e) {
    this.setData({
      ['bag_stat.garbage_cate[' + e.currentTarget.dataset.ids + '].garbage_cate_id']: e.currentTarget.dataset.id,
      ['bag_stat.garbage_cate[' + e.currentTarget.dataset.ids + '].garbage_cate_name']: e.currentTarget.dataset.name,
      ['bag_stat.garbage_cate[' + e.currentTarget.dataset.ids + '].price']: e.currentTarget.dataset.price,
      ['bag_stat.garbage_cate[' + e.currentTarget.dataset.ids + '].xiala']: false,
    })
  },
  input(e) {
    this.setData({
      ['bag_stat.garbage_cate[' + e.currentTarget.dataset.index + '].price']: e.detail.value,
    })
  },
  pay_true(){
    var data = {
      tag_key: this.data.tag_key
    },that = this;
    for (var key in this.data.bag_stat.garbage_cate) {
      data['detail[' + key + '][garbage_cate_id]'] = this.data.bag_stat.garbage_cate[key].garbage_cate_id;
      data['detail[' + key + '][price]'] = this.data.bag_stat.garbage_cate[key].price
    }
    util.postJSON({ apiUrl: apiurl.stationOrderStore, data: data }, function (res) {
      var result = res.data.result
      wx.navigateTo({
        url: '../edcs/edcs',
      })
    })
    
  },
  // pay(){

  // },
  radioChange: function (e) {//入驻类型选择
    this.setData({
      payment: e.detail.value
    })
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  model(e) {
    this.setData({
      showmodel: !this.data.showmodel,
    })
  },
  
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