// pages/result/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({
  data: {
    flag: true,
    width:72,
    hint:''
  },
  onLoad(e) {
    var pages = getCurrentPages(),
      that = this;
    console.log(pages);
    for (var i in pages) {
      console.log(pages[i]['__route__'])
    }
    this.setData({
      logo: getApp().globalData.config.logo
    })
    
    var delta = pages.length > 2 ? pages.length - 2 : 1
    that.setData({
      pages: pages,
      delta: delta,
    })
    if (e.pay_key){
      that.query(e.pay_key)
    }else{
      this.setData({
        hint: getApp().globalData.hint
      })
    }
  },
  query(pay_key){
    var that = this;
    util.postJSON({
      apiUrl: apiurl.query,
      data: {
        pay_key: pay_key,
        hint:1
      }
    }, function (res2) {
      console.log(res2)
      that.setData({
        hint: res2.data.result.hint,
      })
      console.log(res2)
      wx.setNavigationBarTitle({
        title: res2.data.result.hint.header,
      })
      util.hideLoading()
    }, function () {

    }, function () {

    })
  },
  ok(e) {
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
      if (this.data.pages < 3) {
        
        return wx.navigateBack()
      } else {
        this.setData({
          flag: false
        })
        wx.reLaunch({
          url: url,
          success() {
            flag: true
          }
        })
      }
    } else if (url.indexOf('../assets/index') > -1 ) {
      this.setData({
        flag: false
      })
      return  wx.navigateBack({delta:1})
    } else {
      return wx.navigateTo({
        url: url,
        fail: function() {
          util.alert('该功能暂未开放，敬请期待')
        },
      })
    }
  },
  back() {
    wx.navigateBack({
      delta: this.data.delta
    })
  },
  onUnload: function() {
    if (this.data.flag) {
      wx.navigateBack({
        delta: this.data.delta
      })
    }

  },
})