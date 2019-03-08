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
    money:"",
    yu:0,
    show:true,
    is_password:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.hasOwnProperty("balance")){
      this.setData({
        yu: options.balance,
        is_password: options.is_password
      })
    }
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
      money: that.data.yu,
      sure: false,
    })
  },
  open_no(e){
    var that = this;
    wx.showModal({
      content: '是否确认提现',
      success: function (res) {
        if (res.confirm) {
          that.setData({
            sure:true
          })
          util.postJSON({ apiUrl: apiurl.balanceWithdraw, data: { amount: that.data.money } }, function (res) { 
            util.alert(res.data.message);
            wx.navigateTo({
              url: '../my_gold/my_gold',
            })
          })
        }
      }
      
    })
    
  },
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
    var sure = true
      if (e.detail.value) {
        sure=false
      }
    this.setData({
      money: e.detail.value,
      sure: sure
    })
  },
  
  
  
})