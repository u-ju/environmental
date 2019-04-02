// pages/result/index.js
Page({
  data: {

  },
  onLoad(e) {
    var hint = JSON.parse(e.hint)
    wx.hideLoading()
    this.setData({
      hint: hint
    })
    wx.setNavigationBarTitle({
      title: hint.header,
    })
  },
  link(e) {
    if (!e.currentTarget.dataset.link || JSON.stringify(e.currentTarget.dataset.link) == "{}") {
      return wx.navigateBack()
    }
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
    console.log(url)
    wx.navigateTo({
      url: url,
      fail: function () {
        util.alert('该功能暂未开放，敬请期待')
      },
    })
  },
})