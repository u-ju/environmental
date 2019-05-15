// pages/shopping_mall/shopping_mall.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var bmap = require('../../utils/bmap-wx.min.js'); 
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
    list: '',
    list:[],
    shop_cate:[0],
    type: "",
    url1: "",
    address:'',
    erji:[],
    cate_id:0,

    hideHeader: true,
    hideBottom: true,
    refreshTime: '', // 刷新的时间 
    loadMoreData: '加载更多……',
    erjinum:1,
    cate_ids:0,
    tabTxt: ['附近 ', '餐饮美食', '智能排序', '筛选'],
    tabactive:-1,
    qyopen: false,
    qyshow: true,
    isfull: false,
  },
  search(e) {

    this.setData({
      search: e.detail.value
    })
    if (e.detail.value == '') {
      this.setData({
        keywords: ""
      })
      this.init(1, '')
    }
  },
  searchSubmit(e) {
    
    var keywords =  this.data.search
    this.setData({
      keywords: keywords,
      indexSize: -1
    })
    this.init('', 1)
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
    })
    wx.showLoading({
      title: '加载中',
    })
    this.config()
    var shop_cate = app.globalData.config.shop_cate||[]
    // that.setData({
    //   shop_cate: shop_cate,
    //   erji: shop_cate[0].children,
    //   cate_id: shop_cate[0].id,
    //   cate_ids: shop_cate[0].id,
    //   tablen: Math.ceil(shop_cate.length / 10)
    // })
    that.address()
    if (shop_cate.length>0){
      if (options.keywords){
        var keywords = options.keywords
        this.setData({
          keywords: keywords,
          search: keywords,
          indexSize: -1
        })
        this.init('', 1, keywords)
      }else{
        that.init();
      }
    
  }else{
    wx.hideLoading()
    }
  },
  config() {
    var that = this;
    util.getJSON({ apiUrl: apiurl.config }, function (res) {
      var result = res.data.result;
      getApp().globalData.config = result;
      var shop_cate = app.globalData.config.shop_cate
      var tabTxt = that.data.tabTxt
      tabTxt[1] = shop_cate[0].name;
      var eara=[]
      eara.push(shop_cate)
      console.log(eara)
      that.setData({
        eara: eara,
        shop_cate: shop_cate,
        erji: shop_cate[0].children,
        cate_id: shop_cate[0].id,
        cate_ids: shop_cate[0].id,
        tablen: Math.ceil(shop_cate.length / 10),
        tabTxt: tabTxt
      })
      that.init();
    })
  },
  init(cate_id = this.data.shop_cate[0].id, page = 1, keywords='') {
    var that = this;
    if (that.data.keywords != '' && that.data.keywords != undefined) {
      keywords = that.data.keywords
    }
    util.getJSON({
      apiUrl: apiurl.shop + "?type=" + that.data.type ,
      // + "&keywords" + keywords, 
      data: { cate_id: cate_id, page: page, keywords: keywords}
      }, function (res) {
      var result = res.data.result
      var list = result.list
        
      for (var key in list){
        list[key].distance = that.distance(app.globalData.latitude, app.globalData.longitude, list[key].latitude, list[key].longitude)
      }
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
  address(){
    var that = this;
    // 新建百度地图对象 
    var BMap = new bmap.BMapWX({
      ak: 'DebUHwMKH2yOlHOHlXiVlZTeCuFnRgZo'
    });
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      var wxMarkerData = data.wxMarkerData;
      that.setData({
        latitude: wxMarkerData[0].latitude,
        longitude: wxMarkerData[0].longitude,
        address: wxMarkerData[0].address
      });
    }
    // 发起regeocoding检索请求 
    BMap.regeocoding({
      fail: fail,
      success: success,
    }); 
  },
  
  calling: function (e) {//拨打电话
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.contact, //此号码并非真实电话号码，仅用于测试
      success: function () {
        console.log("拨打电话成功！")
        
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },

  distance(la1, lo1, la2, lo2) {//计算经纬度的距离
    var La1 = la1 * Math.PI / 180.0;
    var La2 = la2 * Math.PI / 180.0;
    var La3 = La1 - La2;
    var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
    s = s * 6378.137; //地球半径
    
    // console.log("计算结果",s)
    var juli = Math.round((s * 10000) / 10000 * 1000)
    if (juli>1000){
      s = Math.round((s * 10000) / 10000)+"km";
    }else{
      s = Math.round((s * 10000) / 10000 * 1000)+"m";
    }
    return s
  },
  detail(e){
    wx.navigateTo({
      url: '../business_details/index?id=' + e.currentTarget.id,
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
      that.init(that.data.cate_id, Number(that.data.page.current_page) + 1)
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
      that.init(that.data.cate_id, 1)
    
  },
  filterTab(e){
    // console.log(e.currentTarget.dataset.index)
    // console.log(wx.pageScrollTo)
    var index = e.currentTarget.dataset.index;
    var qyopen = true, isfull = true
    if (this.data.qyopen) {
      qyopen = false
      isfull = false
      index = this.data.tabIndex
    }
    this.setData({
      tabIndex: index,
      qyopen: qyopen,
      qyshow: false,
      isfull: isfull
    })
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 320
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
    })
  },
  select: function (e) {
    var that = this;
    
  },
  selctTab(e) {
    console.log(e)
    var shop_cate = this.data.shop_cate;
    for (var i in shop_cate) {
      if (shop_cate[i].children) {
        for (var a in shop_cate[i].children) {
          shop_cate[i].children[a].active = 0
        }
      }
    }
    var tabTxt = this.data.tabTxt
    tabTxt[1] = e.currentTarget.dataset.name;
    this.setData({
      indexSize: e.currentTarget.dataset.index,
      cate_id: e.currentTarget.dataset.current,
      cate_ids: e.currentTarget.dataset.current,
      erji: this.data.shop_cate[e.currentTarget.dataset.index].children || [],
      shop_cate: shop_cate,
      erjinum: 1,
      tabTxt: tabTxt
    })
    this.init(Number(e.currentTarget.dataset.current))
  },
  choose0(e) {
    var that = this, eara = that.data.eara;
    var tabTxt = this.data.tabTxt
    tabTxt[0] = e.currentTarget.dataset.name;
    console.log(e)
    if (e.currentTarget.dataset.item.children && e.currentTarget.dataset.item.children.length>0){
      eara[e.currentTarget.dataset.indexnum - 0 + 1] = e.currentTarget.dataset.item.children
      this.setData({
        eara: eara
      })
      console.log(eara)
    }else{
      that.setData({
        tabTxt: tabTxt
      })
      that.hidebg()
    }
  },
  choose1(e) {
    var that = this, erji = that.data.erji, erjinum = 0, id = e.currentTarget.dataset.id;
    var tabTxt = this.data.tabTxt
    tabTxt[1] = e.currentTarget.dataset.name;
    wx.showLoading({
      title: '加载中',
    })
    that.setData({
      erji: erji,
      cate_id: id,
      erjinum: erjinum,
      tabTxt: tabTxt
    })
    that.init(id)
    that.hidebg()
  },
})