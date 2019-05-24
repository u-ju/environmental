// pages/agriculturalMerchantsOrderDeail/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: {},
    visible2: false,
    order_logistics: [],
    visible1:false,
    skunum:1,
    show:[false],
    express_name:[],
    express_key:[],
    express_num:[],
    expressbtn:false,
    exurl:'shopOrder_deliver',
  },
  addexpress() {
    var express_name = this.data.express_name
    var express_key = this.data.express_key
    var express_num = this.data.express_num
    var show = this.data.show
    express_name.push('')
    express_key.push('')
    // express_num.push('')
    show.push(false)
    this.setData({
      skunum: this.data.skunum + 1,
      express_name: express_name,
      express_key: express_key,
      // express_num: express_num
    })
  },
  delsku(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      skunum: this.data.skunum - 1,
    })
    // var thumb = this.data.thumb.splice(index, 1)
    // var images = this.data.images.splice(index, 1)
    // var key_name = this.data.key_name.splice(index, 1)
    // var key = this.data.key.splice(index, 1)
    var show = this.data.show.splice(index, 1)
  },
  // 点击下拉显示框
  selectTap(e) {
    console.log(e.currentTarget.dataset.index)
    var show = this.data.show
    show[e.currentTarget.dataset.index] = !show[e.currentTarget.dataset.index]
    this.setData({
      show: show
    });
  },

  // 点击下拉列表
  optionTap(e) {
    let name = e.currentTarget.dataset.name;
    let keyv = e.currentTarget.dataset.key;
    var express_name = this.data.express_name
    var express_key = this.data.express_key
    
    express_key[e.currentTarget.dataset.indexnum] = keyv
      express_name[e.currentTarget.dataset.indexnum] = name
    var show = this.data.show
    show[e.currentTarget.dataset.indexnum] = !show[e.currentTarget.dataset.indexnum]
    this.setData({
      express_name: express_name,
      express_key: express_key,
      show: show,
    });
  },
  dellog(e){
    console.log(e.currentTarget.dataset.id)
    var that = this;
    wx.showModal({
      title: '提醒',
      content: '是否确定取消订单？',
      cancelText: '否',
      cancelColor: '#2EB354',
      confirmText: '是',
      confirmColor: '#444444',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.expressDestroy(e.currentTarget.dataset.id)
        } else {
          console.log('用户点击取消')
        }

      }
    })
    
  },
  expressDestroy(id){
    var that = this,data={};
    data.order_id = that.data.order_id
    data['logistics_id[0]']=id
    util.postJSON({ apiUrl: apiurl.shopOrder_expressDestroy, data: data }, function (res) {
      var result = res.data.result
      that.init(that.data.order_id)
      wx.hideLoading()
    }, function (e) {
      
    }, function (e) {
      
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    // this.init(options.id)
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      // 
      order_id: options.id
    })
    var order_logistics_express = [
      {
        "key": "SFEXPRESS",
        "name": "顺丰快递"
            },
      {
        "key": "EMS",
        "name": "EMS"
            },
      {
        "key": "STO",
        "name": "申通快递"
            },
      {
        "key": "YTO",
        "name": "圆通快递"
            },
      {
        "key": "ZTO",
        "name": "中通快递"
            },
      {
        "key": "YUNDA",
        "name": "韵达快递"
            },
      {
        "key": "JD",
        "name": "京东快递"
            },
      {
        "key": "DEPPON",
        "name": "德邦物流"
            },
      {
        "key": "HTKY",
        "name": "百世快递"
            }
    ]
    this.setData({
      // app.globalData.config.order_logistics_express
      order_logistics_express: order_logistics_express
    })
  },
  onShow() {
    if (this.data.order_id) {
      this.init(this.data.order_id)
    }
  },
  tiaozhuan(e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../installment_details/installment_details?id=' + e.currentTarget.dataset.id,
    })
  },
  init(order_id) {
    var that = this;
    util.getJSON({ apiUrl: apiurl.shopOrder_show + "?order_id=" + order_id }, function (res) {
      var result = res.data.result
      console.log(result)
      that.setData({
        result: result,
        order_logistics: result.order_logistics,
        order_id: order_id
      })
      wx.hideLoading()
    }, function (e) {
      console.log(e)
    }, function (e) {
      // var page = getCurrentPages.pop()
      // page.onLoad()
    })
  },
  click(e) {
    console.log(e)
    var that = this;
    var btn = {
      deliver: 'shopOrder_deliver',
      // receive: 'userOrder_receive',
      // comment: 'url'
    }
    console.log(e.currentTarget.dataset.key)
    if (e.currentTarget.dataset.key =='deliver'){
      that.deliver()
    } else if (e.currentTarget.dataset.key == 'logistics') {
      that.open2()
    }

  },

  open2() {
    this.setData({
      visible2: true,
    })
  },
  onClose2() {
    this.setData({
      visible2: false,
    })
  },
  deliver(){
    this.setData({
      visible1: true,
    })
  },
  onClose1(){
    this.setData({
      visible1: false,
    })
  },
  addwl(){
    this.setData({
      visible1: true,
      visible2: false,
      exurl:'shopOrder_expressStore'
    })
  },
  formSubmit(e){
    console.log(e.detail.value)
    var that = this;
    that.setData({
      expressbtn:true
    })
    var data = e.detail.value
    data.order_id = that.data.order_id
    for (var i in that.data.express_key){
      data['logistics[' + i+'][express_key]'] = that.data.express_key[i]
    }
    util.postJSON({ apiUrl: apiurl[that.data.exurl], data: data }, function (res) {
      var result = res.data.result
      that.setData({
        expressbtn: false,
        visible1: false,
        skunum: 1,
        show: [false],
        express_name: [],
        express_key: [],
        express_num: [],
      })
      that.init(that.data.order_id)
      wx.hideLoading()
    }, function (e) {
      that.setData({
        expressbtn: false
      })
    }, function (e) {
      that.setData({
        expressbtn: false
      })
    })
  },
  inputs(e){
    var that = this;
    util.testwl(e.detail.value, '请输入正确的物流单号', function () {
      that.setData({
        expressbtn: false
      })
    })
    var express_num = this.data.express_num
    express_num[e.currentTarget.dataset.index] = e.detail.value
    this.setData({
      express_num: express_num
    })
  }
})