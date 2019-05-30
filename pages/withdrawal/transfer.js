// pages/withdrawal/transfer.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:1,
    sure:true,
    list:[0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type,
      yu:options.money,
      url: options.type == 1 ?"walletIntegralTransfer":"walletBalanceTransfer"
    })
    this.init()
  },
  init() {
    var that = this;
    util.getJSON({ apiUrl: apiurl.familyIndex }, function (res) {
      var result = res.data.result
      util.hideLoading()
      var current = result.list[0] && result.list[0]["user_id"] ? result.list[0]["user_id"]:'';
      console.log(result.list)
      that.setData({
        list: result.list,
        current: current 
      })
      
    })
  },
  choose(e) {
    this.setData({
      current: e.currentTarget.dataset.user_id
    })
  },
  all() {
    var that = this
    this.setData({
      amount: that.data.yu,
      sure: false,
    })
  },
  onChange(e) {
    var sure = true, value = e.detail.value
    if (e.detail.value) {
      sure = false
    }
    if (value > Number(this.data.yu)) {
      value = this.data.yu
    }

    this.setData({
      amount: value,
      sure: sure
    })
  },
  onblur() {
    var that = this
    util.testjq(this.data.amount, "请输入正确转账格式", function () {
      that.setData({
        sure: true
      })
    })
  },
  formSubmit(e) {
    var that = this;
    if (this.data.current===''){
     return util.alert1('请选择转账成员');
    }
    wx.showModal({
      content: '是否确认转账',
      success: function (res) {
        if (res.confirm) {
          that.setData({
            sure: true
          })
          util.postJSON({ apiUrl: apiurl[that.data.url], data: { amount: that.data.amount, user_id: that.data.current } }, function (res) {
            util.alert(res.data.message);
            util.navigateBack();
            that.setData({
              sure: false
            })
          }, function () {
            that.setData({
              sure: false
            })
          }, function () {
            that.setData({
              sure: false
            })
          })
        }
      }

    })
    console.log(e.detail.value.amount)
  }
  
})