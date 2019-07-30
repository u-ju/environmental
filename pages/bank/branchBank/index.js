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
    // that.init()

  },
  init() {
    var that = this;
    var data={
      provId: wx.getStorageSync('provIndex').provId,
      cityId: wx.getStorageSync('cityIndex').cityId,
      bankId: wx.getStorageSync('headBankIndex').bankId
    }
    util.getJSON({ apiUrl: apiurl.huifu.branchBankIndex ,data:data }, function (res) {
      var result = res.data.result
      var list = result.list;
      var name = []

      wxSortPickerView.init(list, that, ['branchName','bankUnionCode']);
      that.setData({
        list: list
      })
      util.hideLoading()
    })
  },
  search(e){
    var list=this.data.list,arr=[];
    for(var i in list){
      if (list[i]["branchName"].indexOf(e.detail.value.replace(/\s*/g, "")) > -1){
        arr.push(list[i])
      }
    }
    wxSortPickerView.init(arr, this, ['branchName', 'bankUnionCode']);
    console.log(arr)
  },
  wxSortPickerViewItemTap: function (e) {
    var data = {
      "bankUnionCode": e.currentTarget.dataset.text.id,
      "branchName": e.currentTarget.dataset.text.text
    }
    wx.setStorageSync('branchBankIndex', data)
    if (this.data.isbtn) {
      util.navigateBack(4)
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
    if (wx.getStorageSync('headBankIndex').bankId) {
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
