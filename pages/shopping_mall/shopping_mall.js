// pages/shopping_mall/shopping_mall.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
// var bmap = require('../../utils/bmap-wx.min.js'); 
var qqmapsdk;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,//显示面板指示点
    autoplay: false,//自动播放
    beforeColor: "#DCDCDC",//指示点颜色
    afterColor: "#27AAD9",//当前选中的指示点颜色
    interval: 10000,
    duration: 1000,
    indexSize: 0,
    list:[0],
    shop_cate:[0],
    type: "",
    url1: "",
    address:'',
    erji:[],
    cate_id:'',

    hideHeader: true,
    hideBottom: true,
    refreshTime: '', // 刷新的时间 
    loadMoreData: '加载更多……',
    erjinum:1,
    cate_ids:0,
    tabTxt: ['智能排序', '附近 ', '餐饮美食', '筛选'],
    tabactive:-1,
    qyopen: false,
    qyshow: true,
    isfull: false,
    area_id:'',
    location:'',
    keywords:'',
    cost:"",
    feature:'',
    costindex:-1,
    sort:''
  },
  search(e) {

    this.setData({
      keywords: e.detail.value
    })
    if (e.detail.value == '') {
      this.setData({
        keywords: "",
      })
      this.init()
    }
  },
  searchSubmit(e) {
    
    var keywords = this.data.keywords
    this.setData({
      keywords: keywords,
      indexSize: -1
    })
    this.init()
  },
  change(e) {
    if (!e.detail.source){
      return false;
    }
    var shop_cate = this.data.shop_cate;
    for (var i in shop_cate) {
      if (shop_cate[i].children) {
        for (var a in [i].children) {
          shop_cate[i].children[a].active = 0
        }
      }
    }
    this.setData({
      indexSize: e.detail.current,
      cate_id: this.data.shop_cate[e.detail.current].id,
      erji: this.data.shop_cate[e.detail.current].children || [],
      shop_cate: shop_cate
    })
    wx.showLoading({
      title: '加载中',
    })
    this.init(Number(shop_cate[e.detail.current].id))
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this;
    var type = 2;
    
    that.setData({
      type: type,
      s_height: wx.getSystemInfoSync().windowHeight - 42,
      all_height: wx.getSystemInfoSync().windowHeight,

      address: wx.getStorageSync('locAddress')
    })
    wx.showLoading({
      title: '加载中',
    })
    this.config()
    var shop_cate = app.globalData.config.shop_cate||[]
    
    util.address(function (data){
      that.setData({
        latitude: data.latitude,
        longitude: data.longitude,
      })
      that.areaparse()
    })
    that.shop_conf()
    if (shop_cate.length>0){
      if (options.keywords){
        var keywords = options.keywords
        this.setData({
          keywords: keywords,
          search: keywords,
          indexSize: -1,
          cate_id:''
        })
      }
  }else{
    wx.hideLoading()
    }
  },
  shop_conf(){
    var that = this;
    util.getJSON({ apiUrl: apiurl.shop_conf }, function (res) {
      that.setData({
        searchitem: res.data.result.search
      })
    })
  },
  config() {
    var that = this;
    util.getJSON({ apiUrl: apiurl.config }, function (res) {
      var result = res.data.result;
      getApp().globalData.config = result;
      var shop_cate = app.globalData.config.shop_cate
      var tabTxt = that.data.tabTxt
      tabTxt[2] = shop_cate[0].name;

      that.setData({
        shop_cate: shop_cate,
        erji: shop_cate[0].children,
        cate_id: shop_cate[0].id,
        cate_ids: shop_cate[0].id,
        tabTxt2: shop_cate[0].name,
        tablen: Math.ceil(shop_cate.length / 10),
        tabTxt: tabTxt
      })
      that.init();
    })
  },
  init( page = 1) {
    var that = this;
    var data = { source:"offline",cate_id: that.data.cate_id, page: page, keywords: that.data.keywords, area_id: that.data.area_id, location: that.data.location, feature: this.data.feature, cost: this.data.cost, sort: that.data.sort }
    
    util.getJSON({
      apiUrl: apiurl.shop + "?type=" + that.data.type , 
      data: data
      }, function (res) {
      var result = res.data.result
      var list = result.list
        
      // for (var key in list){
      //   list[key].distance = that.distance(app.globalData.latitude, app.globalData.longitude, list[key].latitude, list[key].longitude)
      // }
      if (page != 1) {
        list = that.data.list.concat(list)
      }
      that.setData({
        list: list,
        page: result.page,
        hideHeader:true,
        hideBottom: true
      })
      wx.hideLoading()
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
  addressd(pid, name, cb){
    var that = this;
    util.getJSON({ apiUrl: apiurl.area + pid }, function (res) {
      var area = res.data.result.list, array = []
      area.unshift({
        "area_id": pid,
        "name": "全"+name,
        "type": "",
        "parent_id": "",
        "sort": "0"
      })
      cb(area)
    })
  },
  detail(e){
    // console.log(e)
    wx.navigateTo({
      url: '../business_details/business_details?id=' + e.currentTarget.dataset.id,
    })
  },
  loadMore: function () {
    var that = this;
    // 显示加载图标
    
    // 页数+1
    if (Number(that.data.page.current_page) != Number(that.data.page.last_page)) {
      wx.showLoading({
        title: '玩命加载中',
      })
      that.init( Number(that.data.page.current_page) + 1)
    } else {
      
      that.setData({
        last: true
      })
      // util.alert("加载完成")
    }
  },
  // 下拉刷新
  refresh: function (e) {
    
    var that = this;
      var date = new Date();
      that.setData({
        refreshTime: date.toLocaleTimeString(),
        // hideHeader: false
      })
      that.init(1)
    
  },
  filterTab(e){
    var index = e.currentTarget.dataset.index;
    var qyopen = true, isfull = true, sort = this.data.sort
    if (index == this.data.tabIndex){
      sort=''
      index=-1
    } else if (index==0){
      sort='smart'
    }
    this.setData({
      // area_id: '',
      // location: '',
      // keywords: '',
      // cate_id:'',
      // cost: "",
      // feature: '',
      // tabTxt: ['智能排序', '附近 ', '餐饮美食', '筛选'],
      sort: sort,
      tabIndex: index,
      qyopen: qyopen,
      qyshow: false,
      isfull: isfull
    })
    if (e.currentTarget.dataset.index == 0) {
      this.init()
    }
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 322
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  // 点击灰色背景隐藏所有的筛选内容
  hidebg: function (e) {
    // var tabTxt = this.data.tabTxt
    // tabTxt[0] = this.data.currentname[this.data.current.length - 1];
    this.setData({
      qyopen: false,
      isfull: false,
      tabIndex:-1
    })
  },
  select: function (e) {
    var that = this;
    
  },
  selctTab(e) {
    var shop_cate = this.data.shop_cate;
    for (var i in shop_cate) {
      if (shop_cate[i].children) {
        for (var a in shop_cate[i].children) {
          shop_cate[i].children[a].active = 0
        }
      }
    }
    var tabTxt = this.data.tabTxt
    tabTxt[2] = e.currentTarget.dataset.name;
    this.setData({
      indexSize: e.currentTarget.dataset.index,
      cate_id: e.currentTarget.dataset.current,
      cate_ids: e.currentTarget.dataset.current,
      tabTxt2: e.currentTarget.dataset.name,
      erji: this.data.shop_cate[e.currentTarget.dataset.index].children || [],
      shop_cate: shop_cate,
      erjinum: 1,
      tabTxt: tabTxt
    })
    this.init()
  },
  choose1(e) {
    var that = this;
    var tabTxt = this.data.tabTxt
    tabTxt[1] = e.currentTarget.dataset.name;
    var id = e.currentTarget.dataset.id
    if (e.currentTarget.dataset.indexnum == 0 && e.currentTarget.dataset.id != this.data.eara[0][0]['area_id']){
      that.addressd(e.currentTarget.dataset.id, e.currentTarget.dataset.name,function(e){
        var eara = that.data.eara, earaid = that.data.earaid
        eara[1]=e
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
  choose2(e) {
    var that = this, erji = that.data.erji, erjinum = 0, id = e.currentTarget.dataset.id;
    var tabTxt = this.data.tabTxt
    tabTxt[2] = e.currentTarget.dataset.name;
    // wx.showLoading({
    //   title: '加载中',
    // })
    that.setData({
      erji: erji,
      cate_id: id,
      erjinum: erjinum,
      tabTxt: tabTxt
    })
    // that.init(id)
    // that.hidebg()
  },
  choose3(e){
    // console.log(e)
    var key = e.currentTarget.dataset.key, name = e.currentTarget.dataset.name, index = e.currentTarget.dataset.index;
    if (name=="cost"){
      if(key==this.data.cost){
        key=''
        index=-1
      }
      this.setData({
        cost: key,
        costindex: index
      })
    } else if (name =="feature"){
      if (key == this.data.feature) {
        key = ''
      }
      this.setData({
        feature: key
      })
    }
  },
  quyuEmpty1() {
    var eara = this.data.eara, earaid = this.data.earaid
    eara.length=1;
    earaid.length = 1;
    var tabTxt = this.data.tabTxt
    tabTxt[1] = '附近';
    this.setData({
      eara: eara,
      earaid: earaid,
      area_id: '',
      tabTxt: tabTxt
    })
    this.hidebg()
    this.init()
  },
  submitFilter1() {
    this.setData({
      area_id: this.data.earaid[this.data.earaid.length-1],
      sort: 'location',
      location: this.data.longitude + ',' + this.data.latitude 
    })
    this.init()
    this.hidebg()
  },
  quyuEmpty2() {
    var tabTxt = this.data.tabTxt
    tabTxt[2] = this.data.tabTxt2;
    this.setData({
      // this.data.cate_ids
      cate_id: '',
      tabTxt: tabTxt,
      location:' '
    })
    // this.hidebg()
    this.init()
  },
  submitFilter2() {
    
    this.init()
    this.hidebg()
  },
  quyuEmpty3() {
    var tabTxt = this.data.tabTxt
    this.setData({
      cost: '',
      feature: '',
      sort:'',
      costindex:-1
    })
    // this.hidebg()
    this.init()
  },
  submitFilter3() {
    this.setData({
      sort:''
    })
    this.init()
    this.hidebg()
  },
})