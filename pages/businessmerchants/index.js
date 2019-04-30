// pages/businessmerchants/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: '0',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var tabs = [
      {
        "id": "5",
        "name": "全部"
      },
      {
        "id": "0",
        "name": "待确认                   "
      },
      {
        "id": "1",
        "name": "已确认"
      },
    ]
    for (var i in tabs) {
      tabs[i]["key"] = tabs[i]["id"]
    }
    this.setData({
      tabs: tabs,
      status: tabs[0]["id"]
    })
  },
  onTabsChange(e) {
    console.log(e)
    const { key } = e.detail
    const index = this.data.tabs.map((n) => n.key).indexOf(key)

    this.setData({
      key,
      index,
    })
    this.setData({
      status: this.data.tabs[index].id
    })
    this.init(this.data.tabs[index].id)
  },
  init(status = this.data.tabs[0]["id"], page = 1) {
    var that = this, plurl = '';
    if (status == that.data.tabs.length - 1) {
      status = ''
      if (that.data.order_id.length > 0) {
        var order_id = that.data.order_id
        for (var i in order_id) {
          plurl = plurl + "&order_id[" + i + "]=" + order_id[i]
        }
      }
    }

    util.getJSON({ apiUrl: apiurl.userOrder_index + "?page=" + page + "&status=" + status + plurl }, function (res) {
      var result = res.data.result
      // console.log(result)
      var list = result.list
      if (page != 1) {
        list = that.data.list.concat(list)
      }
      that.setData({
        list: list,
        page: result.page,
        last: false,
        height: list.length * 290
      })
      wx.hideLoading()
    })
  },
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    util.getJSON({ apiUrl: apiurl.userOrder_index + "?page=" + 1 + "&status=" + that.data.status }, function (res) {
      var result = res.data.result
      // console.log(result)
      var list = result.list

      that.setData({
        list: list,
        page: result.page,
        last: false,
        height: list.length * 300
      })
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
      wx.hideLoading()
    })

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    // 页数+1
    if (Number(that.data.page.current_page) != Number(that.data.page.last_page)) {
      that.init(Number(that.data.page.current_page) + 1, that.data.status)
    } else {
      that.setData({
        last: true
      })
      wx.hideLoading()
    }
  },
})