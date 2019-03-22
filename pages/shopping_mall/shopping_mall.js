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
    indexSize: 0,
    indicatorDots: false,
    autoplay: false,
    duration: 0, //可以控制动画
    list: '',
    list:[],
    shop_cate:[],
    type: "",
    url1: "",
    address:'',
    erji:[],
    cate_id:0,

    hideHeader: true,
    hideBottom: true,
    refreshTime: '', // 刷新的时间 
    loadMoreData: '加载更多……'
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
    // console.log(keywords)
    this.init('', 1)
  },
  change(e) {
    console.log(e)
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
  scrollTo(e) {
    console.log(this.data.cate_id)
    console.log(e)
    var shop_cate = this.data.shop_cate;
    for (var i in shop_cate) {
      if (shop_cate[i].children) {
        for (var a in shop_cate[i].children) {
          shop_cate[i].children[a].active = 0
        }
      }
    }
    this.setData({
      indexSize: e.currentTarget.dataset.index,
      cate_id: e.currentTarget.dataset.current,
      erji: this.data.shop_cate[e.currentTarget.dataset.index].children || [],
      shop_cate: shop_cate
    })
    
    // wx.showLoading({
    //   title: '加载中',
    // })
    this.init(Number(e.currentTarget.dataset.current))
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this;
    var type = 2;
    var title = '联盟商家'
    if (options.type){
      type = options.type
      title = '便民服务'
    }
    
    that.setData({
      type: type
    })
    wx.setNavigationBarTitle({
      title: title,
    })
    wx.showLoading({
      title: '加载中',
    })
    var shop_cate = app.globalData.config.shop_cate
    // if (type==1){
    //   shop_cate = app.globalData.config.tshop_cate
    // }
    that.setData({
      shop_cate: shop_cate,
      erji: shop_cate[0].children,
      cate_id: shop_cate[0].id
    })
    if (shop_cate.length>0){
      if (options.keywords){
        var keywords = options.keywords
        this.setData({
          keywords: keywords,
          search: keywords,
          indexSize: -1
        })
        console.log(keywords)
        this.init('', 1, keywords)
      }else{
        that.init();
      }
    
  }else{
    wx.hideLoading()
    }
    that.address()

  },
  init(cate_id = this.data.shop_cate[0].id, page = 1, keywords='') {
    var that = this;
    // console.log(keywords)
    if (that.data.keywords != '' && that.data.keywords != undefined) {
      keywords = that.data.keywords
    }
    console.log(keywords)
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
  chooseerji(e){
    var that = this, erji = that.data.erji;
    wx.showLoading({
      title: '加载中',
    })
    for(var i in erji){
      
      erji[i]["active"] = 0
    }
    erji[e.currentTarget.dataset.index].active = 1
    that.setData({
      erji: erji,
      cate_id:e.currentTarget.dataset.id
    })
    
    that.init(e.currentTarget.dataset.id)
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
      url: '../business_details/business_details?t_shop_id=' + e.currentTarget.id,
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
})