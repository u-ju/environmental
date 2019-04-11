// pages/my_order_detail/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result:{},
    visible2: false,
    order_logistics:[]
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
      order_id: options.id
    })
  },
  onShow(){
    if (this.data.order_id){
      this.init(this.data.order_id)
    }
  },
  tiaozhuan(e){
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../installment_details/installment_details?id=' + e.currentTarget.dataset.id,
    })
  },
  init(order_id) {
    var that = this;
    util.getJSON({ apiUrl: apiurl.userOrder_show + "?order_id="+order_id }, function (res) {
      var result = res.data.result
      
      that.setData({
        result: result,
        order_logistics: result.order_logistics,
      })
      wx.hideLoading()
    },function(e){
      console.log(e)
    },function(e){
      var page = getCurrentPages.pop()
      page.onLoad()
    })
  },
  click(e){
    console.log(e)
    var that = this;
    var btn = {
      cancel:'userOrder_cancel',
      receive:'userOrder_receive',
      comment:'url'
    }
    for(var i in btn){
      // console.log(i, btn[i], apiurl[btn[i]])
      if (e.currentTarget.dataset.key==i){
        if (btn[i]=="url"){
          var order_goods = that.data.result.order_goods, pjurl=''
          for (var i in order_goods) {
            pjurl = pjurl + "&comment[" + i + "][sku_id]=" + order_goods[i].sku_id
          }
          return wx.navigateTo({
            url: '../comment/index?id=' + that.data.result.order_id + pjurl,
          })
        }
        var apiurlnow = apiurl[btn[i]]
        wx.showModal({
          title: '提醒',
          content: '是否' + e.currentTarget.dataset.name + "?",
          cancelText: '否',
          cancelColor: '#2EB354',
          confirmText: '是',
          confirmColor: '#444444',
          success: function (res) {
            if (res.confirm) {

              util.postJSON({ apiUrl: apiurlnow, data: { order_id: that.data.order_id } }, function (res) {
                var result = res.data.result
                util.alert(res.data.message)
                wx.navigateBack()
                wx.showLoading({
                  title: '加载中',
                })
              })
            } else {
              console.log('用户点击取消')
            }

          }
        })
      }
    }
    
    
  },
  open2() {
    this.setData({
      visible2: true,
    })
  },
  onClose2(){
    this.setData({
      visible2: false,
    })
  }
})