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
    // 页面初始化 options为页面跳转所带来的参数
    // app.func.req('getCarBrand?cx=1', function (res) {
    //   if (res.data.result == 'false') {
    //     console.log('false');
    //     that.wetoast.toast({
    //       title: res.data.msg,
    //       duration: 2000
    //     })
    //   } else {
    //     that.setData({
    //       brandList: res.data.brandList,
    //       wordindex: res.data.brandList,
    //     });
    //     var cData = that.data.brandList;
    //     cData[0].wordindex = "#";//先修改json值
    //     that.setData({ //再set值
    //       wordindex: cData
    //     })
    //   }
    // }, function (res) {

    // });
  that.init()
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
        list: list,
      })
      util.hideLoading()
    })
  },
  wxSortPickerViewItemTap: function (e) {
    console.log(e.currentTarget.dataset.text);
    wx.setStorageSync("locAddress", e.currentTarget.dataset.text.text)
    wx.setStorageSync("locAddressID", e.currentTarget.dataset.text.id)
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
