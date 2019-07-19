// pages/business/index.js

const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner_arr:[],
    cate_arr:[],
    repair:{},
    list: [0],
    page: {},
    choosed:[],
    choose:'',
    search:'',
    keywords:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.loading()
    if (options.keywords){
      var keywords = "&keywords=" + options.keywords
      this.setData({
        keywords: keywords,
        search: options.keywords
      })
    }
    wx.setStorageSync("locAddresscity", '')
    wx.setStorageSync("locAddresscityID", '')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  search(e){
    if (e.detail.value==''){
      this.setData({
        keywords: "&keywords=" 
      })
      this.init(1, '')
    }
    this.setData({
      search: e.detail.value
    })
  },
  searchSubmit(e){
    var keywords = "&keywords="+this.data.search
    this.setData({
      keywords: keywords
    })
    this.init(1, keywords)
  },
  choose(e){
    // // console.log(e.currentTarget.dataset.choose)
    var cate_arr = this.data.cate_arr, choosed = this.data.choosed, choose = this.data.choose
    // cate_arr[e.currentTarget.dataset.index].choose = !e.currentTarget.dataset.choose
    // if (choosed.indexOf(e.currentTarget.dataset.id)==-1){
    //   choosed.push(e.currentTarget.dataset.id)
    // }else{
    //   choosed.splice(choosed.indexOf(e.currentTarget.dataset.id), 1); 
    // }
    wx.showLoading()
    for (var i in cate_arr){
      cate_arr[i]["choose"]=false
    }
    cate_arr[e.currentTarget.dataset.index].choose = !e.currentTarget.dataset.choose
    if (choose == e.currentTarget.dataset.id){
      choose=''
    }else{
      choose = e.currentTarget.dataset.id
    }
    this.setData({
      cate_arr: cate_arr,
      choose: choose
    })
    this.init()
  },
  orderShow() {
    var that = this;
    util.getJSON({ apiUrl: apiurl.repair_home }, function (res) {
      var cate_arr = res.data.result.cate_arr
      for (var i in cate_arr){
        cate_arr[i]["choose"]=false
      }
      that.setData({
        is_repair: res.data.result.is_repair,
        banner_arr: res.data.result.banner_arr,
        cate_arr: cate_arr,
      })
    })
  },
  init(page = 1, keywords='') {
    var that = this, pjurl = '', area_id='';
    if (that.data.choose.length > 0 && that.data.choose !=undefined){
      pjurl = "&cate_tag[0]=" + that.data.choose
      // for (var i in that.data.choosed){
      //   pjurl = pjurl + "&cate_tag[" + i + "]=" + that.data.choosed[i]
      // }
    }
    if (wx.getStorageSync('locAddresscityID') != '' && wx.getStorageSync('locAddresscityID') != undefined) {
      area_id = "&area_id="+wx.getStorageSync('locAddresscityID')
    }
    if (that.data.keywords != '' && that.data.keywords != undefined) {
      keywords = that.data.keywords
    }
    util.getJSON({ apiUrl: apiurl.repair_index + "?page=" + page + pjurl + area_id+ keywords}, function (res) {
      var result = res.data.result
      var list = result.list||[]
      if (page != 1) {
        list = that.data.list.concat(list)
      }
      // console.log(list)
      that.setData({
        list: list,
        page: result.page,
      })
      wx.hideLoading()
    })
  },
  detail(e){
    // console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../maintenanceworker_detail/index?id=' + e.currentTarget.dataset.id +"&url=repair_show",
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this, pjurl="";
    if (that.data.choosed.length > 0 && that.data.choosed != undefined) {
      for (var i in that.data.choosed) {
        pjurl = pjurl + "&cate_tag[" + i + "]=" + that.data.choosed[i]
      }
    }
    util.getJSON({ apiUrl: apiurl.repair_index + "?page=1" + pjurl}, function (res) {
      var result = res.data.result
      // console.log(result)
      that.setData({
        list: result.list,
        page: result.page,
        last: false
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
  calling: function (e) {//拨打电话
    // console.log(e.target.dataset.phone)
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.phone, //此号码并非真实电话号码，仅用于测试
      success: function () {
        // console.log("拨打电话成功！")
      },
      fail: function () {
        // console.log("拨打电话失败！")
      }
    })
  },
  weixiu(e){
    
    var repair = this.data.is_repair||''
    wx.navigateTo({
      url: '../maintenance_worker/index?repair=' + repair,
    })
  },
  onShow(){
    this.orderShow()
    this.setData({
      address: wx.getStorageSync('locAddresscity')||wx.getStorageSync('locAddress')
    })
    // console.log(wx.getStorageSync('locAddresscity') || wx.getStorageSync('locAddress'))
    this.init()
  },
  nav(){
    wx.navigateTo({
      url: '../area/index?type=city',
    })
    
  }
})