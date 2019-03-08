// pages/sorting/sorting.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth:0,
    windowHeight:0,
    xiala:false,
    type:'瓶子',
    tab:[],
    detail:[],
    disabled:true,
    bag_no:'',
    created_at:'',
    order_id:''
  },
 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this
    // console.log(app.globalData.config)
    // that.setData({
    //   tab: app.globalData.config.garbage_cate
    // })
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
    util.getJSON({ apiUrl: apiurl.config }, function (res) {
      var result = res.data.result;
      that.setData({
        tab: result.garbage_cate
      })
    })
    if (options.order_id){
      util.getJSON({ apiUrl: apiurl.bagOrderSorterShow + '?order_id=' + options.order_id}, function (res) {
        var result = res.data.result
        that.setData({
          detail: result.details,
          order_id: options.order_id,
          bag_no: result.bag_no,
          created_at: result.created_at,
        })
        wx.hideLoading()
      })
    }
    if (options.status==0){
      that.setData({
        disabled: false
      })
    }
    if (options.qrcode){
      // util.postJSON({ apiUrl: apiurl.qrCode, data: { qrcode: options.qrcode}}, function (res) {
      //   var result = res.data.result
        that.setData({
          bag_no: options.qrcode,
        })
      //   wx.hideLoading()
      // })
    }
    
  },
  xiala(e) {
    this.setData({
      ['detail[' + e.currentTarget.dataset.index + '].xiala']: !this.data.detail[e.currentTarget.dataset.index ].xiala
    })
  },
  select(e) {
    console.log(!this.data['detail[' + e.currentTarget.dataset.ids + '].xiala'])
    this.setData({
      ['detail[' + e.currentTarget.dataset.ids + '].garbage_cate_id']: e.currentTarget.dataset.id,
      ['detail[' + e.currentTarget.dataset.ids + '].garbage_cate_name']: e.currentTarget.dataset.name,
      ['detail[' + e.currentTarget.dataset.ids + '].price']: e.currentTarget.dataset.price,
      ['detail[' + e.currentTarget.dataset.ids + '].xiala']: false,
    })
  },
  add(){//新增
  console.log(1)
    var detail = { id: this.data.detail.length, garbage_cate_id: this.data.tab[0].id, garbage_cate_name: this.data.tab[0].name, count: '', weight: '', price: this.data.tab[0].price, xiala: false, amount:'' }
    this.setData({
      detail: this.data.detail.concat(detail)
    })
  },
  input(e){
    this.setData({
      ['detail[' + e.currentTarget.dataset.index + '].' + e.currentTarget.dataset.name ]: e.detail.value,
    })
  },
  formSubmit(e){
    console.log(e)
    var data = e.detail.value;
    for (var key in this.data.detail){
      data['detail[' + key +'][garbage_cate_id]'] = this.data.detail[key].garbage_cate_id
    }
    var url = apiurl.bagOrderStore;
    if (this.data.order_id){
      url = apiurl.bagOrderUpdate
      data.order_id = this.data.order_id
    }else{
      data.bag_no = this.data.bag_no
    }
    util.postJSON({ apiUrl: url, data: data }, function (res) {
      var result = res.data.result
      // util.alert(res.data.message)
      wx.navigateTo({
        url: '../edcs/edcs',
      })

    })
  },
  del(e){
    var detail = this.data.detail
    detail.splice(e.currentTarget.dataset.index, 1); 
    this.setData({
      detail: detail
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