// pages/agriculturalRecommendation/index.js
// index/list.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabTxt: ['分类',  '销量' ,'价格'],//分类
    tab: [1, 1, 1],
    pinpaiList: [{ 'id': '1', 'title': '品牌1' }, { 'id': '2', 'title': '品牌2' }],
    pinpai_id: 0,//品牌
    pinpai_txt: '',
    jiage_id: 0,//价格
    jiage_txt: '',
    xiaoliang_id: 0,//销量
    xiaoliang_txt: '',
    arrprice: ['asc','des'],
    arrsales: ['asc', 'des'],
    price:'des',
    sales:'des'
  },

  // 选项卡
  filterTab: function (e) {
    var data =this.data.tab, index = e.currentTarget.dataset.index;
    data[index] = !this.data.tab[index];
    this.setData({
      tab: data,
      price: this.data.arrprice[data[2]],
      sales: this.data.arrprice[data[1]] 
    })
    console.log(data)
  },

  //筛选项点击操作
  filter: function (e) {

    var self = this, id = e.currentTarget.dataset.id, txt = e.currentTarget.dataset.txt, tabTxt = this.data.tabTxt, tab = this.data.tab;
    tabTxt[0] = txt;
    tab[0] = !this.data.tab[0];
    self.setData({
      tab: tab,
      tabTxt: tabTxt,
      pinpai_id: id,
      pinpai_txt: txt
    });
    //数据筛选
    self.getDataList();
  },
  hiddenzzc(){
    var tab = this.data.tab;
    tab[0] = !this.data.tab[0];
    this.setData({
      tab: tab,
    })
  },
  onLoad(e){
    this.init()
  },
  init(page = 1) {
    var that = this;
    if (that.data.keywords != '' && that.data.keywords != undefined) {
      keywords = that.data.keywords
    }
    util.getJSON({
      apiUrl: apiurl.goods + "?page=" + page + "&source=online&price=" + that.data.price + "&sales=" + that.data.sales
    }, function (res) {
      var result = res.data.result
      var list = result.list
      if (page != 1) {
        list = that.data.news.concat(list)
      }
      that.setData({
        list: list,
        page: result.page,
        last: false,
      })
      util.hideLoading()
    })
  },
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();

    var that = this;
    util.getJSON({
      apiUrl: apiurl.goods + "?page=" + page + "&source=online&price=" + that.data.price + "&sales=" + that.data.sales
    }, function (res) {
      var result = res.data.result
      var list = result.list
      that.setData({
        list: list,
        page: result.page,
        last: false,
      })
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
      util.hideLoading()
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

  detail(e) {
    console.log(e.currentTarget.dataset.sku_id)
    wx.navigateTo({
      url: '../agriculturalDetail/index?id=' + e.currentTarget.dataset.sku_id
    })
  },
})
