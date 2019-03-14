// pages/my_invitation/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
       {
        "key": "0",
        "title": "联盟商家",
        url: 'agent_shopIndex'
      },
      {
        "key": "1",
        "title": "业务专员",
        url: 'agent_agentIndex'
      },
    ],
    current: '0',
    url:'',
    list:[],
    page:{},
    list1: [],
    page1: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.init()
    this.init1()
  },
  onChange(e) {
    // console.log('onChange', e)
    this.setData({
      current: e.detail.key,
    })
  },
  onTabsChange(e) {
    // console.log('onTabsChange', e)

    const { key } = e.detail
    const index = this.data.tabs.map((n) => n.key).indexOf(key)

    this.setData({
      key,
      index,
    })
  },
  onSwiperChange(e) {
    console.log('onSwiperChange', e)
    const { current: index, source } = e.detail
    const { key } = this.data.tabs[index]
    console.log(e.detail.current)
    if (!!source) {
      this.setData({
        key,
        index
      })
    }
    this.init()
  },
  init(page = 1) {
    var that = this;
    util.getJSON({ apiUrl: apiurl.agent_shopIndex + "?page=" + page }, function (res) {
      var result = res.data.result
      var list = result.list
      if (page != 1) {
        list = that.data.list.concat(list)
      }
      that.setData({
        list: list,
        page: result.page,
        last: false,
        height: list.length * 176
      })
      util.hideLoading()
      // console.log(list)
    })
  },
  init1(page = 1) {
    var that = this;
    util.getJSON({ apiUrl: apiurl.agent_agentIndex + "?page=" + page }, function (res) {
      var result = res.data.result
      var list = result.list
      if (page != 1) {
        list = that.data.list1.concat(list)
      }
      that.setData({
        list1: list,
        page1: result.page,
        last: false,
        height1: list.length * 176
      })
      // console.log(list)
      util.hideLoading()
    })
  },
  refresh(){
    var that = this;
    var date = new Date();
    that.setData({
      refreshTime: date.toLocaleTimeString(),
    })
    that.init( 1)
  },
  loadMore(){
    
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    // 页数+1
    if (Number(that.data.page.current_page) != Number(that.data.page.last_page)) {
      that.init( Number(that.data.page.current_page) + 1)
    } else {
      that.setData({
        last: true
      })
      util.alert("加载完成")
    }
  },
  refresh1() {
    var that = this;
    var date = new Date();
    that.setData({
      refreshTime: date.toLocaleTimeString(),
    })
    that.init1(1)
  },
  loadMore1() {

    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    // 页数+1
    if (Number(that.data.page1.current_page) != Number(that.data.page1.last_page)) {
      that.init1(Number(that.data.page1.current_page) + 1)
    } else {
      that.setData({
        last: true
      })
      util.alert("加载完成")
    }
  },
})