// pages/recruitment/recruit/interview/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */                                       
  data: {
    tabTxt: ['最新', '成都 ', '公司', '要求'],
    list:[],
    tabIndex:-1
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
  },
  init(page = 1) {
    var that = this;
    var data = {}
    // { source: "offline", cate_id: that.data.cate_id, page: page, keywords: that.data.keywords, area_id: that.data.area_id, location: that.data.location, feature: this.data.feature, cost: this.data.cost, sort: that.data.sort }

    util.getJSON({
      apiUrl: apiurl.recruit.postIndex + "?1=1",
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
  choose1(e) {
    var that = this;
    var tabTxt = this.data.tabTxt
    tabTxt[1] = e.currentTarget.dataset.name;
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
      tabTxt: tabTxt
    })
  },
  submitFilter1() {
    this.setData({
      area_id: this.data.earaid[this.data.earaid.length - 1],
      sort: 'location',
      location: this.data.longitude + ',' + this.data.latitude
    })
    // this.init()
    this.hidebg()
  },
  quyuEmpty1() {
    var eara = this.data.eara, earaid = this.data.earaid
    eara.length = 1;
    // earaid.length = 1;
    console.log(earaid)
    var tabTxt = this.data.tabTxt
    tabTxt[1] = '成都';
    this.setData({
      eara: eara,
      earaid: [wx.getStorageSync('locAddressID')],
      area_id: '',
      tabTxt: tabTxt
    })
    // this.hidebg()
    // this.init()
  },
  // choose2(e) {
  //   var that = this, erji = that.data.erji, erjinum = 0, id = e.currentTarget.dataset.id;
  //   var tabTxt = this.data.tabTxt
  //   tabTxt[2] = e.currentTarget.dataset.name;
  //   // wx.showLoading({
  //   //   title: '加载中',
  //   // })
  //   that.setData({
  //     erji: erji,
  //     cate_id: id,
  //     erjinum: erjinum,
  //     tabTxt: tabTxt
  //   })
  //   // that.init(id)
  //   // that.hidebg()
  // },
  // choose3(e) {
  //   // console.log(e)
  //   var key = e.currentTarget.dataset.key, name = e.currentTarget.dataset.name, index = e.currentTarget.dataset.index;
  //   if (name == "cost") {
  //     if (key == this.data.cost) {
  //       key = ''
  //       index = -1
  //     }
  //     this.setData({
  //       cost: key,
  //       costindex: index
  //     })
  //   } else if (name == "feature") {
  //     if (key == this.data.feature) {
  //       key = ''
  //     }
  //     this.setData({
  //       feature: key
  //     })
  //   }
  // },
  // quyuEmpty1() {
  //   var eara = this.data.eara, earaid = this.data.earaid
  //   eara.length = 1;
  //   earaid.length = 1;
  //   var tabTxt = this.data.tabTxt
  //   tabTxt[1] = '附近';
  //   this.setData({
  //     eara: eara,
  //     earaid: earaid,
  //     area_id: '',
  //     tabTxt: tabTxt
  //   })
  //   this.hidebg()
  //   this.init()
  // },
  // submitFilter1() {
  //   this.setData({
  //     area_id: this.data.earaid[this.data.earaid.length - 1],
  //     sort: 'location',
  //     location: this.data.longitude + ',' + this.data.latitude
  //   })
  //   this.init()
  //   this.hidebg()
  // },
  // quyuEmpty2() {
  //   var tabTxt = this.data.tabTxt
  //   tabTxt[2] = this.data.tabTxt2;
  //   this.setData({
  //     // this.data.cate_ids
  //     cate_id: '',
  //     tabTxt: tabTxt,
  //     location: ' '
  //   })
  //   // this.hidebg()
  //   this.init()
  // },
  // submitFilter2() {

  //   this.init()
  //   this.hidebg()
  // },
  // quyuEmpty3() {
  //   var tabTxt = this.data.tabTxt
  //   this.setData({
  //     cost: '',
  //     feature: '',
  //     sort: '',
  //     costindex: -1
  //   })
  //   // this.hidebg()
  //   this.init()
  // },
  // submitFilter3() {
  //   this.setData({
  //     sort: ''
  //   })
  //   this.init()
  //   this.hidebg()
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})