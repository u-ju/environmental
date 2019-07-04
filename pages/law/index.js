// pages/law/lawyer/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabTxt: ['区域', '纠纷 '],
    tabTxt1: ['区域', '纠纷 '],
    list: [0],
    tabIndex: -1,
    qyopen: false,
    isfull: false,
    sort: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      address: wx.getStorageSync('locAddresscity') || wx.getStorageSync('locAddress')
    })
    this.areaparse()
    this.init()
    this.conf()
  },
  detail(e) {
    wx.navigateTo({
      url: 'detail/index?id=' + e.currentTarget.dataset.id,
    })
  },
  link() {
    wx.navigateTo({
      url: 'cardCreate/index',
    })
  },
  conf() {
    var that = this;
    util.getJSON({
      apiUrl: apiurl.law.conf,
    }, function (res) {
      var cate_tag = res.data.result.cate_tag
      
      that.setData({
        cate_tagi: cate_tag,
      })
      util.hideLoading()
    })
  },
  init(page = 1) {
    var that = this;
    var data = {
      
      keywords: that.data.keywords || '',
      area_id: that.data.area_id || '',
      cate_tag: that.data.cate_tag || '',
      page:page
    }
    util.getJSON({
      apiUrl: apiurl.law.index + "?1=1",
      data: data
    }, function (res) {
      var result = res.data.result
      var list = result.list
      if (page != 1) {
        list = that.data.list.concat(list)
      }
      that.setData({
        list: list,
        page: result.page,
        hideHeader: true,
        hideBottom: true
      })
      wx.hideLoading()
    })
  },
  addressd(pid, name, cb) {
    var that = this;
    util.getJSON({ apiUrl: apiurl.area + pid }, function (res) {
      var area = res.data.result.list, array = []
      area.unshift({
        "area_id": pid,
        "name": "全" + name,
        "type": "",
        "parent_id": "",
        "sort": "0"
      })
      cb(area)
    })
  },
  areaparse() {
    var that = this;
    that.addressd(wx.getStorageSync('locAddressID'), wx.getStorageSync('locAddress'), function (e) {
      var eara = [], earaid = []
      eara.push(e)
      earaid.push(e[0]["area_id"])
      that.setData({
        eara: eara,
        earaid: earaid
      })
    })
  },
  filterTab(e) {
    var index = e.currentTarget.dataset.index;
    var qyopen = true, isfull = true, sort = this.data.sort

    this.setData({
      tabIndex: index,
      qyopen: qyopen,
      qyshow: false,
      isfull: isfull
    })

  },
  hidebg: function (e) {
    this.setData({
      qyopen: false,
      isfull: false,
      tabIndex: -1
    })
  },
  
  choose0(e) {
    var that = this;


    var id = e.currentTarget.dataset.id
    if (e.currentTarget.dataset.indexnum == 0 && e.currentTarget.dataset.id != this.data.eara[0][0]['area_id']) {
      that.addressd(e.currentTarget.dataset.id, e.currentTarget.dataset.name, function (e) {
        var eara = that.data.eara, earaid = that.data.earaid
        eara[1] = e
        earaid[0] = id
        earaid[1] = e[0]["area_id"]
        that.setData({
          eara: eara,
          earaid: earaid
        })
      })
    }

    var earaid = that.data.earaid;
    earaid[e.currentTarget.dataset.indexnum] = e.currentTarget.dataset.id
    that.setData({
      earaid: earaid,
      earaname: e.currentTarget.dataset.name
    })
  },
  submitFilter0() {
    var tabTxt = util.copyarr(this.data.tabTxt1)
    tabTxt[0] = this.data.earaname;
    this.setData({
      tabTxt: tabTxt,
      area_id: this.data.earaid[this.data.earaid.length - 1],
      cate_tag:''
    })
    this.hidebg()
  },
  quyuEmpty0() {
    var eara = this.data.eara, earaid = this.data.earaid
    eara.length = 1;
    console.log(earaid)
    var tabTxt = util.copyarr(this.data.tabTxt1)
    this.setData({
      eara: eara,
      earaid: [wx.getStorageSync('locAddressID')],
      area_id: '',
      tabTxt: util.copyarr(this.data.tabTxt1)
    })
  },
  choose1(e) {
    this.setData({
      cate_: e.currentTarget.dataset.id,
      cate_name: e.currentTarget.dataset.name
    })
  },
  submitFilter1() {
    var tabTxt = util.copyarr(this.data.tabTxt1)
    tabTxt[1] = this.data.cate_name;
    this.setData({
      tabTxt: tabTxt,
      cate_tag: this.data.cate_,
      area_id: '',
    })
    this.hidebg()
  },
  quyuEmpty1() {
    this.setData({
      cate_tag: '',
      tabTxt: util.copyarr(this.data.tabTxt1)
    })
    this.hidebg()
  },

  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    var that = this;
    var data = {

      keywords: that.data.keywords || '',
      area_id: that.data.area_id || '',
      cate_tag: that.data.cate_tag || ''
    }
    util.getJSON({
      apiUrl: apiurl.law.index + "?page=1",
      data: data
    }, function (res) {
      var result = res.data.result
      var list = result.list
      that.setData({
        list: list,
        page: result.page,
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
      that.init( Number(that.data.page.current_page) + 1)
    } else {
      that.setData({
        last: true
      })
      wx.hideLoading()
    }
  },
})