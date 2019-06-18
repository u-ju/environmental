// pages/result/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({
  data: {
    flag:true
  },
  onLoad(e) {
    util.loading()
    var pages = getCurrentPages();
    console.log(pages);
    var delta = pages.length>2?pages.length - 2:1
    var hint = JSON.parse(e.hint)
    wx.hideLoading()
    this.setData({
      hint: hint,
      pages: pages,
      delta: delta
    })
    wx.setNavigationBarTitle({
      title: hint.header,
    })
  },
  ok(e){
    var url = e.currentTarget.dataset.link.control
    if (JSON.stringify(e.currentTarget.dataset.link.params) != "{}") {
      url = url + "?1=1"
      for (var i in e.currentTarget.dataset.link.params) {

        console.log(i, e.currentTarget.dataset.link.params[i])
        url = url + "&" + i + "=" + e.currentTarget.dataset.link.params[i]
      }
    }
    if (e.currentTarget.dataset.children != '' && e.currentTarget.dataset.children != undefined) {
      url = url + "?children=" + JSON.stringify(e.currentTarget.dataset.children)
    }

    if (url.indexOf('../index/index') > -1 || url.indexOf('../personal_center/personal_center') > -1) {
      console.log(url)
      if (this.data.pages < 3) {
        return wx.navigateBack()
      } else {
        console.log(url)
        this.setData({
          flag: false
        })
        wx.reLaunch({
          url: url,
          success(){
            flag: true
          }
        })
      }
    } else {
      return wx.navigateTo({
        url: url,
        fail: function () {
          util.alert('该功能暂未开放，敬请期待')
        },
      })
    }
  },
  back(){
    wx.navigateBack({ delta: this.data.delta })
  },
  onUnload: function() {
    if (this.data.flag){
      wx.navigateBack({
        delta: this.data.delta
      })
    }

  },
})