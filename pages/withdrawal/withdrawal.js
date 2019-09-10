// pages/withdrawal/withdrawal.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
const isTel = (value) => !/^1[34578]\d{9}$/.test(value)
import { $wuxKeyBoard } from '../../Components/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sure: true,
    amount:"",
    yu:10,
    show:true,
    is_password:"",
    withdraw_flow:[
      
    ],
    current:"wechat",
    withdraw:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    // util.loading()
    var withdraw_flow = app.globalData.settle_withdraw_flow
    if (options.url =='balanceWithdraw'){
      withdraw_flow = app.globalData.balance_withdraw_flow
    }
    var txxx = (wx.getStorageSync('txxx') && JSON.parse(wx.getStorageSync('txxx')))||[]
    this.setData({
      withdraw_flow: withdraw_flow,
      is_password: options.is_password,
      current: withdraw_flow[0]["key"],
      yu: options.money,
      url: options.url,
      card_no: txxx.card_no || '',
      cardholder: txxx.cardholder||'',
      sub_branch: txxx.sub_branch || '',
      withdraw: app.globalData.config.protocol.withdraw
    })
    util.hideLoading();
  },
  choose(e){
    console.log(e.currentTarget.dataset.key)
    this.setData({
      current: e.currentTarget.dataset.key
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
  all(){
    var that =this
    this.setData({
      amount: that.data.yu,
      sure: false,
    })
  },
  // open_no(e){
  //   var that = this;
  //   wx.showModal({
  //     content: '是否确认提现',
  //     success: function (res) {
  //       if (res.confirm) {
  //         that.setData({
  //           sure:true
  //         })
  //         util.postJSON({ apiUrl: apiurl.balanceWithdraw, data: { amount: that.data.money } }, function (res) { 
  //           util.alert(res.data.message);
  //           util.navigateBack();
  //         })
  //       }
  //     }
      
  //   })
    
  // },
  open() {
    console.log(1234567)
    $wuxKeyBoard().show({
      callback(value) {
        console.log(`输入的密码是：${value}`)
        return true
      },
    })
   
  },
  onChange(e) {
    var sure = true, value = e.detail.value
    if (e.detail.value) {
      sure=false
    }
    if (value > Number(this.data.yu)){
      value = this.data.yu
    }
    
    this.setData({
      amount: value,
      sure: sure
    })
  },
  onblur(){
    // var amount = this.data.amount
    // if (!/^\d+(\.\d{1,2})?$/.test(amount)) {
    //   util.alert("请输入正确的金额格式")
    // }
    var that = this
    util.testjq(this.data.amount, "请输入正确的金额格式",function(){
      // console.log(that.data.sure)
      that.setData({
        sure:true
      })
      // console.log(that.data.sure)
    })
  },
  formSubmit(e){
    // var amount = this.data.amount
    // if (!/^\d+(\.\d{1,2})?$/.test(amount)) {
    //  return util.alert("请输入正确的金额格式")
    // }
    var that = this;
    wx.showModal({
      content: '是否确认提现',
      success: function (res) {
        if (res.confirm) {
          var data={}
          data.amount = that.data.amount
          data.flow = that.data.current
          data.flow_ext = app.globalData.appid
          if (that.data.current == 'bankcard') {
            // data=e.detail.value
            data.flow_ext = JSON.stringify({ card_no: e.detail.value.card_no, cardholder: e.detail.value.cardholder, sub_branch: e.detail.value.sub_branch })
          }
          that.setData({
            sure:true
          })
          util.postJSON({ apiUrl: apiurl[that.data.url], data:data}, function (res) { 
            util.alert(res.data.message);
            util.navigateBack();
            that.setData({
              sure: false
            })
            wx.setStorageSync('txxx', JSON.stringify({ card_no: e.detail.value.card_no, cardholder: e.detail.value.cardholder, sub_branch: e.detail.value.sub_branch }))
          },function(){
            that.setData({
              sure: false
            })
          },function(){
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