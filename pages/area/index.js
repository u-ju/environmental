// pages/area/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
var wxSortPickerView = require('../../Components/wxSortPickerView/wxSortPickerView.js');
Page({
  data: {
    "brandList": [],
    "wordindex": [],
    "toView": '#',

  },
  onLoad: function (options) {
    var that = this;
    if (options.type=="city"){
      that.initcity()
    }else{
      that.init()
    }
    
  },
  init() {
    var that = this;
    util.getJSON({ apiUrl: apiurl.arealayerIndex + 'city' }, function (res) {
      var result = res.data.result
      var list = result.list;
      var name=[]
      // for (var i in list){
      //   name.push(list[i]["name"])
      // }
      wxSortPickerView.init(list, that);
      that.setData({
        list: list
      })
      util.hideLoading()
    })
  },
  initcity() {
    var that = this;
    util.getJSON({ apiUrl: apiurl.area + wx.getStorageSync('locAddressID') }, function (res) {
      var result = res.data.result
      var list = result.list;
      var name = []
      wxSortPickerView.init(list, that);
      that.setData({
        list: list,
        type: "city"
      })
      util.hideLoading()
    })
  },
  wxSortPickerViewItemTap: function (e) {
    
    if (this.data.type=="city"){
      
      wx.setStorageSync("locAddresscity", e.currentTarget.dataset.text.text)
      wx.setStorageSync("locAddresscityID", e.currentTarget.dataset.text.id)
    }else{
      wx.setStorageSync("locAddress", e.currentTarget.dataset.text.text)
      wx.setStorageSync("locAddressID", e.currentTarget.dataset.text.id)
    }
    wx.navigateBack()
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
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
