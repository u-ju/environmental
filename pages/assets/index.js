// pages/assets/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: [],
    gold: true,
    isRuleTrue: false,
    list: [0],
    balance: "",
    integral: "",
    page: {},
    url: '',
    withdraw: '',
    tab: [],
    current:1,
    withdraw_status:'',
    ji: ['integralIndex',"walletIntegralFamilyIndex"],
    jin: ['balanceIndex', "walletBalanceFamilyIndex"],
    integralurl:'integralIndex',
    balanceurl: 'balanceIndex',
  },
  tabchange(e){
    util.loading()
    this.setData({
      current: e.currentTarget.dataset.index
    })
    this.init(1,e.currentTarget.dataset.index)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.loading()
    if (options.id){
      this.setData({
        current: options.id
      })
    }
  },
  integral(e){
    // console.log(e)
    var tab = this.data.tab
    tab[0]["url"] = e.currentTarget.dataset.url
    this.setData({
      integralurl: e.currentTarget.dataset.url,
      tab: tab
    })
    this.init()
  },
  balance(e){
    var tab = this.data.tab
    tab[1]["url"] = e.currentTarget.dataset.url
    this.setData({
      balanceurl: e.currentTarget.dataset.url,
      tab: tab
    })
    this.init()
  },
  Initialize(){
    var that = this;
    util.getJSON({ apiUrl: apiurl.wallet }, function (res) {
      var result = res.data.result;
      // console.log(result)
      var tab = [
        
        { id: 1, name: '环保积分', url: 'integralIndex' },
        { id: 0, name: '环保金', url: 'balanceIndex' },
      ]
      if (result.is_shop == 1) {
        tab = [
          { id: 1, name: '环保积分', url: 'integralIndex' },
          { id: 0, name: '环保金', url: 'balanceIndex' },
          { id: 2, name: '我的货款', url: 'settleIndex' },
        ]
      }
      that.setData({
        tab: tab,
        width: 100 / tab.length+"%",
        balance: result.balance,
        integral: result.integral,
        settle: result.settle,
        is_password: result.is_password,
        balance_withdraw_flow: JSON.stringify(result.balance_withdraw_flow),
        settle_withdraw_flow: JSON.stringify(result.settle_withdraw_flow),
        has_family: result.has_family||'',
        integralurl: 'integralIndex',
        balanceurl: 'balanceIndex',
      })
      util.hideLoading()
      that.init()
    })
  },
  init(page = 1, current) {
    var that = this;
    if (current == '' || current == undefined){
      current = that.data.current
    }
    var url=''
    for (var i in that.data.tab){
      if (that.data.tab[i]["id"] == current){
        url = that.data.tab[i]["url"]
      }
    }
    util.getJSON({ apiUrl: apiurl[url] + '?page=' + page }, function (res) {
      var result = res.data.result
      var list = result.list
      if (page != 1) {
        list = that.data.list.concat(list)
      }
      // console.log(list)
      that.setData({
        list: list,
        page: result.page
      })
      util.hideLoading()
    })
  },
  //打开规则提示
  showRule: function () {
    this.setData({
      isRuleTrue: true
    })
  },
  //关闭规则提示
  hideRule: function () {
    this.setData({
      isRuleTrue: false
    })
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
    if (this.data.current !== '' && this.data.current !== undefined){
      
      this.Initialize()
    }
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    wx.showNavigationBarLoading();
    util.getJSON({ apiUrl: apiurl[that.data.tab[that.data.current]["url"]] + '?page=' + 1 }, function (res) {
      var result = res.data.result
      var list = result.list
      that.setData({
        list: list,
        page: result.page
      })
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
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
      mask:true
    })
    // 页数+1
    if (Number(that.data.page.current_page) != Number(that.data.page.last_page)) {
      that.init(Number(that.data.page.current_page) + 1)
    } else {
      that.setData({
        last: true
      })
      wx.hideLoading()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})