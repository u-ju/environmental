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
    // var that = this;
    // that.init()

  },
  init() {
    var that = this;
    util.getJSON({ apiUrl: apiurl.huifu.cityIndex + '?provId=' + wx.getStorageSync('provIndex').provId }, function (res) {
      var result = res.data.result
      var list = result.list;
      var name = []

      wxSortPickerView.init(list, that, ['cityName','cityId']);
      that.setData({
        list: list
      })
      util.hideLoading()
    })
  },
  search(e){
    var list=this.data.list,arr=[];
    for(var i in list){
      if (list[i]["cityName"].indexOf(e.detail.value.replace(/\s*/g, "")) > -1){
        arr.push(list[i])
      }
    }
    wxSortPickerView.init(arr, this, ['cityName', 'cityId']);
    console.log(arr)
  },
  wxSortPickerViewItemTap: function (e) {
    console.log(e)
    var data = {
      "cityId": e.currentTarget.dataset.text.id,
      "cityName": e.currentTarget.dataset.text.text
    }
    wx.setStorageSync('cityIndex', data)
    wx.setStorageSync('branchBankIndex', '')
    if (this.data.isbtn) {
      wx.navigateTo({
        url: '../headBankIndex/index',
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
    // 页面显示
    if (wx.getStorageSync('provIndex').provId){
      this.init()
    }
    this.setData({
      isbtn: 1
    })
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
