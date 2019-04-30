// pages/order/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({
  data: {
    visible1: false,
    visible2: false,
    visible3: false,
    current: '0',
    height:1100,
    axis: [],
    list: [
      { choosed: 1 },
      { choosed: 0 },
      { choosed: 0 },
    ],
    tabs: [],
    page: {},
    list:[0],
    receiveid:'',
    order_id:[],
    order_logistics:[]
  },
  onLoad(e){
    // console.log(app.globalData.config)
    // app.globalData.config.order_info_search_status
    util.loading()
    var order_info_search_status = [
      {
        "id": "5",
        "name": "全部"
      },
      {
        "id": "0",
        "name": "待发货"
      },
      {
        "id": "1",
        "name": "待收货"
      },
      {
        "id": "2",
        "name": "已完成"
      },
      {
        "id": "3",
        "name": "已关闭"
      },
      {
        "id": "4",
        "name": "待评价"
      }
    ]
    for (var i in order_info_search_status){
      order_info_search_status[i]["key"] = order_info_search_status[i]["id"]
    }
    this.setData({
      tabs:order_info_search_status,
      status: order_info_search_status[0]["id"]
    })
    // this.init()
    if (e.source_ext){
      console.log(JSON.parse(e.source_ext))
      this.setData({
        order_id: JSON.parse(e.source_ext),
        current:'5',
        index:'5',
        key:'5',
        status:5
      })
    }
  },
  onChange(e) {
    console.log(e)
    this.setData({
      current: e.detail.key,
    })
  },
  onTabsChange(e) {
    // console.log(e)
    const { key } = e.detail
    const index = this.data.tabs.map((n) => n.key).indexOf(key)
    
    this.setData({
      key,
      index,
    })
    this.setData({
      status: this.data.tabs[index].id
    })
    this.init(this.data.tabs[index].id)
  },
  onSwiperChange(e) {
    util.loading()
    const { current: index, source } = e.detail
    const { key } = this.data.tabs[index]
    
    if (!!source) {
      this.setData({
        key,
        index,
      })
    }
    this.setData({
      status: this.data.tabs[index].id
    })
    this.init(this.data.tabs[index].id)
  },
  receive(e) {
    this.setData({
      visible1: true,
      receiveid: e.currentTarget.dataset.id
    })
  },
  open2() {
    this.setData({
      visible2: true,
    })
  },
  open3() {
    this.setData({
      visible3: true,
    })
  },
  // 确认收货
  close1() {
    var that = this;
    util.postJSON({ apiUrl: apiurl.userOrder_receive, data: { order_id: that.data.receiveid } }, function (res) {
      var result = res.data.result
      util.alert(res.data.message)
      that.setData({
        visible1: false,
        visible3: true,
      })

    that.init(that.data.status)
      wx.hideLoading()
    })
    

  },
  close2() {
    
    this.setData({
      visible2: false,
    })
  },
  close3() {
    this.setData({
      visible3: false,
    })
  },
  onClose(key) {
    this.setData({
      [key]: false,
    })
  },
  onClose1() {
    console.log('onClose1')
    this.setData({
      visible1: false,
    })
  },
  onClose3() {
    this.setData({
      visible3: false,
    })
  },
  onClose2() {
    this.setData({
      visible2: false,
    })
  },
 
  choose(e) {
    var list = this.data.list
    
    list[e.currentTarget.dataset.id]["choosed"] = !e.currentTarget.dataset.choosed
    this.setData({
      list: list
    })
  },
  cancel(e){
    var that = this;
    wx.showModal({
      title: '提醒',
      content: '是否确定取消订单？',
      cancelText:'否',
      cancelColor:'#2EB354',
      confirmText:'是',
      confirmColor:'#444444',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that._cancel(e.currentTarget.dataset.id)
        } else {
          console.log('用户点击取消')
        }

      }
    })
  },
  logistics(e){
    console.log(e)
    var that = this;
    util.getJSON({ apiUrl: apiurl.userOrder_show + "?order_id=" + e.currentTarget.dataset.id }, function (res) {
      var result = res.data.result
      that.setData({
        order_logistics: result.order_logistics,
        visible2:true
      })
    })
  },
  _cancel(order_id) {
    var that = this;
    util.postJSON({ apiUrl: apiurl.userOrder_cancel, data: { order_id: order_id } }, function (res) {
      var result = res.data.result
      util.alert(res.data.message)
      // that.setData({
      //   result: result
      // })
      that.init(that.data.status)
      wx.hideLoading()
    })
  },
  init(status = this.data.tabs[0]["id"],page = 1) {
    var that = this,plurl='';
    if (status == that.data.tabs.length-1){
      status=''
      if (that.data.order_id.length>0){
        var order_id = that.data.order_id
        for (var i in order_id){
          plurl = plurl + "&order_id[" + i + "]=" + order_id[i]
        }
      }
    }
    
    util.getJSON({ apiUrl: apiurl.userOrder_index + "?page=" + page + "&search_status=" + status + plurl }, function (res) {
      var result = res.data.result
      // console.log(result)
      var list = result.list
      if (page != 1) {
        list = that.data.list.concat(list)
      }
      that.setData({
        list: list,
        page: result.page,
        last: false,
        height: list.length*290
      })
      wx.hideLoading()
    })
  },
  again_buy(){
    wx.navigateTo({
      url: '../installment/installment',
    })
  },

  comment(e) {
    var id = this.data.receiveid;
    var that = this;
    wx.showLoading()
    if (e.currentTarget.dataset.id){
      id = e.currentTarget.dataset.id
    }
    util.getJSON({ apiUrl: apiurl.userOrder_index + "?order_id[0]=" + id  }, function (res) {
      var order_goods = res.data.result.list[0].order_goods, pjurl=''
       
        for (var i in order_goods){
          pjurl = pjurl +"&comment["+i+"][sku_id]="+order_goods[i].sku_id
        }
        wx.navigateTo({
          url: '../comment/index?id=' + id+pjurl,
          success(){
            that.setData({
              visible3:false
            })
          }
        })
        wx.hideLoading()
      })
    // var order_goods = this.data.list[e.currentTarget.dataset.listindex].order_goods
    
    
    
  },
  backindex() {
    wx.reLaunch({
      url: '../index/index',
      success() {
        that.setData({
          visible3: false
        })
      }
    })
  },
  detail(e){
    // console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../my_order_detail/index?id=' + e.currentTarget.dataset.id,
    })
  },
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    util.getJSON({ apiUrl: apiurl.userOrder_index + "?page=" + 1 + "&search_status=" + that.data.status }, function (res) {
      var result = res.data.result
      // console.log(result)
      var list = result.list
      
      that.setData({
        list: list,
        page: result.page,
        last: false,
        height: list.length * 300
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
      that.init(Number(that.data.page.current_page) + 1, that.data.status)
    } else {
      that.setData({
        last: true
      })
      wx.hideLoading()
    }
  },
  onShow(){
    this.init(this.data.status)
  }
})