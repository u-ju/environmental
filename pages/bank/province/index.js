// pages/bank/province/index.js
const app = getApp()
var util = require('../../../utils/util.js');
var apiurl = require('../../../utils/api.js');
var wxSortPickerView = require('../../../Components/wxSortPickerView/wxSortPickerView.js');
Page({
  data: {
    "brandList": [],
    "wordindex": [],
    "toView": '#',

  },
  onLoad: function (options) {
    var that = this;
    that.init()

  },
  init() {
    var that = this;
    util.getJSON({ apiUrl: apiurl.huifu.provIndex }, function (res) {
      var result = res.data.result
      var list = result.list;
      var name = []

      wxSortPickerView.init(list, that, ['provName','provId']);
      that.setData({
        list: list
      })
      util.hideLoading()
    })
  },
  search(e){
    var list=this.data.list,arr=[];
    for(var i in list){
      if (list[i]["provName"].indexOf(e.detail.value.replace(/\s*/g, "")) > -1){
        arr.push(list[i])
      }
    }
    wxSortPickerView.init(arr, this, ['provName', 'provId']);
    console.log(arr)
  },
  wxSortPickerViewItemTap: function (e) {
    console.log(e.currentTarget.dataset.text)
    var data = {
      "provId": e.currentTarget.dataset.text.id,
      "provName": e.currentTarget.dataset.text.text
    }
    wx.setStorageSync('provIndex', data)
    wx.setStorageSync('branchBankIndex', '')
    if (this.data.isbtn){
      wx.navigateTo({
        url: '../city/index',
      })
      this.setData({
        isbtn: 0
      })
    }
    
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    this.setData({
      isbtn:1
    })
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  click: function () {
    wx.navigateTo({
      url: '',
    })
  },
})
