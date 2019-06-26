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
    tab: [1, 0, 0],
    pinpaiList: [],
    pinpai_id: 0,//品牌
    pinpai_txt: '',
    jiage_id: 0,//价格
    jiage_txt: '',
    xiaoliang_id: 0,//销量
    xiaoliang_txt: '',
    qyopen: false,
    qyshow:true,
    current:[],
    currentname:[],
    cate_id:'',
    arrprice: ["sales",'price'],
    sort:'',
    order:'desc',
    isfull:false
  },

  // 选项卡
  filterTab: function (e) {
    var that = this;
    var data =[1,0,0], index = e.currentTarget.dataset.index;
    data[index] = !this.data.tab[index];
    this.setData({
      tab: data,
    })
    if(index!==0){
      this.setData({
        sort: that.data.arrprice[e.currentTarget.dataset.index - 1],
        order: data[index] == 0 ? 'desc' : 'asc',
        tabTxt: ['分类', '销量', '价格'],
      })
      var qyshow = false
      if (this.data.qyshow==true) {
        qyshow = true
      }
      this.setData({
        qyopen: false,
        qyshow: qyshow,
        isfull: false,
        cate_id:''
      })
      this.init()
    }else{
      if (this.data.qyopen) {
        this.setData({
          qyopen: false,
          qyshow: false,
          isfull: false
        })
      } else {
        this.setData({
          qyopen: true,
          qyshow: false,
          isfull: true

        })
      }
    }
  },

  //筛选项点击操作
  // filter: function (e) {

  //   var self = this, id = e.currentTarget.dataset.id, txt = e.currentTarget.dataset.txt, tabTxt = this.data.tabTxt, tab =[1,1,1];
  //   tabTxt[0] = txt;
  //   tab[0] = !this.data.tab[0];
  //   self.setData({
  //     tab: tab,
  //     tabTxt: tabTxt,
  //     pinpai_id: id,
  //     pinpai_txt: txt
  //   });
  //   //数据筛选
  //   self.getDataList();
  // },
  hiddenzzc(){
    var tab = this.data.tab;
    tab[0] = !this.data.tab[0];
    this.setData({
      tab: tab,
    })
  },
  onLoad(e){
    
    var goods_cate = app.globalData.config.goods_cate
    console.log(e)
    var keywords = e.keywords || ''
    this.setData({
      goods: [goods_cate],
      keywords: "&keywords=" + keywords
    })
    this.init()
  },
  init(page = 1) {
    var that = this;
    
    util.getJSON({
      apiUrl: apiurl.goods + "?page=" + page + "&source=online&sort=" + that.data.sort + that.data.keywords+ "&order=" + that.data.order + "&cate_id=" + that.data.cate_id 
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
      apiUrl: apiurl.goods + "?page=" + page + "&source=online&sort=" + that.data.sort + "&order=" + that.data.order + "&cate_id=" + that.data.cate_id
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
  select: function (e) {
    var that = this;
    var goods = this.data.goods;
    var current = that.data.current, currentname = that.data.currentname, txt = e.currentTarget.dataset.item.name, tabTxt = this.data.tabTxt, tab = this.data.tab;
    var id =e.target.dataset.item.id||''
    currentname[e.target.dataset.index] = e.target.dataset.item["name"]
    current[e.target.dataset.index] = e.target.dataset.item["id"]
    if (e.target.dataset.item.hasOwnProperty("children")){
      goods[e.target.dataset.index-0+1] = e.target.dataset.item['children']
    }else{
      tabTxt[0] = txt;
      tab[0] = !this.data.tab[0];
      current.length = e.target.dataset.index-0+1
      currentname.length = e.target.dataset.index - 0 + 1
      goods.length = e.target.dataset.index - 0 + 1

      this.setData({
        qyopen: false,
        isfull: false,
        tab: tab,
        tabTxt: tabTxt,
        cate_id: id,
        currentname: currentname
      })
      that.init()
    }
    
    this.setData({
      goods: goods,
      current: current
    })
  },
  detail(e) {
    wx.navigateTo({
      url: '../installment_details/installment_details?id=' + e.currentTarget.dataset.sku_id
    })
  },
  // 地铁区域列表下拉框是否隐藏
  listqy: function (e) {
    if (this.data.qyopen) {
      this.setData({
        qyopen: false,
        qyshow:false,
      })
    } else {
      this.setData({
        qyopen: true,
        qyshow: false,
        
      })
    }
  },
  quyuEmpty() {
    this.setData({
      qyopen: false,
      isfull: false,
      cate_id: '',
      tab: [1,0,0],
      tabTxt: ['分类', '销量', '价格'],//分类
    })
    this.init()
  },
  submitFilter(){
    var tabTxt = this.data.tabTxt
    
    console.log(this.data.current)
    if (this.data.current.length>0){
      tabTxt[0] = this.data.currentname[this.data.current.length - 1];
      this.setData({
        cate_id: this.data.current[this.data.current.length - 1],
        
      })
    }
    this.setData({
      qyopen: false,
      isfull: false,
      tab: [1,0,0],
      order: 'desc',
      tabTxt: tabTxt
    })
    this.init()
  },
  // 点击灰色背景隐藏所有的筛选内容
  hidebg: function (e) {
    var tabTxt = this.data.tabTxt
    tabTxt[0] = this.data.currentname[this.data.current.length - 1];
    this.setData({
      qyopen: false,
      isfull: false,
      cate_id: '',
      tab: [1, 0, 0],
      order: 'desc',
    })
  },
})
