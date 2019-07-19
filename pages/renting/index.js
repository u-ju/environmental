// pages/renting/index/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabTxt: ['区域', '价格', '更多 '],
    tabTxt1: ['区域', '价格', '更多 '],
    list: [0],
    tabIndex:-1,
    qyopen: true,
    isfull: false,
    sort: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    util.loading()
    this.setData({
      address: wx.getStorageSync('locAddresscity') || wx.getStorageSync('locAddress'),
      keywords: options.keywords || ''
    })
    this.areaparse()
    this.init()
    this.conf()
  },
  search(e) {
    this.setData({
      keywords: e.detail.value
    })
    if (e.detail.value == '') {
      this.init()
    }
  },
  searchSubmit(e) {
    this.init()
  },
  detail(e) {
    wx.navigateTo({
      url: 'detail/index?id=' + e.currentTarget.dataset.id,
    })
  },
  link() {
    wx.navigateTo({
      url: 'list/index',
    })
  },
  
  conf() {
    var that = this;
    util.getJSON({
      apiUrl: apiurl.renting.conf,
    }, function(res) {
      var result = res.data.result
      var sort=[    
        { name: '默认排序', id: '1' },
        { name: '租金从低到高', id: 'asc' },
        { name: '租金从低到高', id: 'desc' },
      ]
      that.setData({
        price_intervali: result.price_interval,
        paymenti:result.payment,
        roomi: result.room,
        decorationi: result.decoration,
        aspecti: result.aspect,
        modei: result.mode,
        sorti: sort
      })
      getApp().globalData.config_tag = result.config_tag
      util.hideLoading()
    })
  },
  init(page = 1) {
    var that = this;
    var data = {
      decoration: that.data.decoration || '',
      mode: that.data.mode || '',
      sort: that.data.sort || '',
      order: that.data.order || '',
      rent: that.data.rent || '',
      keywords: that.data.keywords || '',
      area_id: that.data.area_id || '',
      room: that.data.room || '',
      page: page
    }
    util.getJSON({
      apiUrl: apiurl.renting.index + "?1=1",
      data: data
    }, function(res) {
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
    util.getJSON({
      apiUrl: apiurl.area + pid
    }, function(res) {
      var area = res.data.result.list,
        array = []
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
    that.addressd(wx.getStorageSync('locAddressID'), wx.getStorageSync('locAddress'), function(e) {
      var eara = [],
        earaid = []
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
    var qyopen = true,
      isfull = true,
      sort = this.data.sort

    this.setData({
      tabIndex: index,
      qyopen: qyopen,
      qyshow: false,
      isfull: isfull
    })

  },
  hidebg: function(e) {
    this.setData({
      qyopen: false,
      isfull: false,
      tabIndex: -1
    })
  },

  choose0(e) {
    // var that = ;
    util.areatab(this, e.currentTarget.dataset.indexnum, e.currentTarget.dataset.id,e.currentTarget.dataset.name,2)
  },
  submitFilter0() {
    var tabTxt = util.copyarr(this.data.tabTxt1)
    tabTxt[0] = this.data.earaname;
    this.setData({
      tabTxt: tabTxt,
      area_id: this.data.earaid[this.data.earaid.length - 1],
      rent: '',
      order: '',
      sort: '',
      room: '',
      mode: '',
      decoration: ''
    })
    this.init()
    this.hidebg()
  },
  quyuEmpty0() {
    var eara = this.data.eara,
      earaid = this.data.earaid
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
      min: e.currentTarget.dataset.min || '',
      max: e.currentTarget.dataset.max || ''
    })
  },
  submitFilter1() {
    var tabTxt = util.copyarr(this.data.tabTxt1)
    var name = this.data.min + " - " + this.data.max
    if(!this.data.min){
      name = this.data.max+"元以下"
    } else if(!this.data.max){
      name = this.data.min + "元以上"
    }
    
    tabTxt[1] = name;
    this.setData({
      tabTxt: tabTxt,
      area_id: '',
      rent:this.data.min+","+this.data.max,
      order: '',
      sort: '',
      room: '',
      mode: '',
      decoration: ''
    })
    this.init()
    this.hidebg()
  },
  quyuEmpty1() {
    this.setData({
      tabTxt: util.copyarr(this.data.tabTxt1),
      rent:''
    })
  },
  choose2(e) {
    this.setData({
      [e.currentTarget.dataset.name + 't']: e.currentTarget.dataset.id
    })
    if (e.currentTarget.dataset.name == 'order') {
      this.setData({
        sort: e.currentTarget.dataset.id!=1 ? 'rent' : ''
      })
    }
  },
  submitFilter2() {
    this.setData({
      order: this.data.ordert,
      sort: this.data.sortt,
      room: this.data.roomt,
      mode: this.data.modet,
      decoration: this.data.decorationt,
      area_id: '',
      rent: '',
    })

    this.init()
    this.hidebg()
  },
  quyuEmpty2() {
    var arr = ['order', "sort", 'room', 'mode','decoration']
    for(var i in arr){
      this.setData({
        [arr[i]]:'',
        [arr[i]+'t']: '',
      })
    }
  },
  onPullDownRefresh: function() {
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
      apiUrl: apiurl.renting.index + "?page=1",
      data: data
    }, function(res) {
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
  input(e){
    console.log(e)
    this.setData({
      [e.currentTarget.dataset.name]:e.detail.value
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
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
})