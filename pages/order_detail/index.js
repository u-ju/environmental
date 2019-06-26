// pages/order_detail/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      
      { key: '1', name: '分期付款', intr: '￥206.51 X 2期', choose: 0 },
      { key: '2', name: '环保金支付', choose: 0 },
      { key: '3', name: '微信支付', choose: 0 },
      
    ],
    choosexy: [
      { name: 1, value: '同意', checked: true },
    ],
    choose: ['1'],
    visible3:false,
    result:{},
    address:{},
    payment:'',
    payment_ext:'',
    data:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // if (options.spec_value){
    //   spec_value: 
    // }
    // console.log(JSON.parse(options.result))
    var result = getApp().globalData.order_detail
    console.log(result)
    this.setData({
      result: result,
      order_source: result.order_source,
      data: { pay_source: 'order', order_key: result.order_key },
      nper: app.globalData.config.protocol.nper
      //  address_id: that.data.address.address_id
    })
    
  },
  checkboxChange(e) {
    // console.log(e.detail.value)
    this.setData({
      choose: e.detail.value
    })
  },
  openp(e){
    var page = e.detail.page;
    if (this.data.choose.length < 1) {
      return util.alert("请勾选商品兑换协议")
    }
    page.open3()
  },
  address() {
    var that = this;
    util.getJSON({ apiUrl: apiurl.shippingAddress_index +"?default=1" }, function (res) {
      var result = res.data.result, address = {}, data = that.data.data;
      if (result.list.length>0){
        address=result.list[0]
        
        data.address_id = address.address_id
      }
      
      that.setData({
        address: address,
        data: data
      })
      util.hideLoading()
    })
  },
  open3() {
    var that = this;
    if (this.data.choose.length < 1) {
      return util.alert("请勾选商品兑换协议")
    }
    util.postJSON({ apiUrl: apiurl.create, data: { pay_source: 'order', order_key: that.data.result.order_key, address_id: that.data.address.address_id} },
      function (res) {
        var result = res.data.result
        for (let i in result.payment_usable) {
          result.payment_usable[i].choosed = 0
        }
        result.payment_usable[0].choosed = 1
        that.setData({
          items: result,
          visible3: true,
          pay_amount: result.pay_amount,
          payment: result["payment_usable"][0]["key"]
        })
      })
  },
  close3() {
    this.setData({
      visible3: false,
    })
  },
  onClose3() {
    this.setData({
      visible3: false,
    })
  },
 
  link(){
   var  url= '../address_order/index'
    if (Object.keys(this.data.address).length ==0){
      url = '../address_edit/index'
    }
    wx.navigateTo({
      url: url
    })
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
    this.address()
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