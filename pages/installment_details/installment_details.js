// pages/installment_details/installment_details.js

// 评论列表 选择规格
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,//显示面板指示点
    autoplay: true,//自动播放
    beforeColor: "white",//指示点颜色
    afterColor: "coral",//当前选中的指示点颜色
    interval: 5000,
    duration: 1000,
    banner: [
      { image: '../../images/catering_test.png' },
      { image: '../../images/catering_test.png' },
      { image: '../../images/catering_test.png' },
    ],
    result: "",
    visible1: false,
    visible2: false,
    visible3: false,
    cc:[
      { id: 1, title: '6.1寸' },
      { id: 2, title: '6.2寸' },
      { id: 3, title: '6.3寸' },
      { id: 4, title: '6.4寸' },
      { id: 5, title: '6.5寸' },
      { id: 6, title: '6.6寸' },
      { id: 7, title: '6.7寸' },
      { id: 8, title: '6.8寸' },
    ],
    ys:[
      { id: 1, title: '贝壳' },
      { id: 2, title: '桃心' },
      { id: 3, title: '横纹' },
      { id: 4, title: '球形' },
      { id: 5, title: '小鱼' },
      { id: 6, title: '大海' },
    ],
    items: [
      { name: '1', value: '不分期，市场价购买', choose: 0 },
      { name: '2', value: '￥206.51 X 2期', intr: '含服务费：每期￥6.02，费率0.80%', choose: 0 },
      // { name: '3', value: '￥110.25 X 4期', intr: '含服务费：每期￥6.02，费率0.80%', checked: 'true' },
    ],
    cartArr:[
      { name: '1', value: '已阅读分期协议' },
    ],
    current:0,
    list:[],
    result:{},
    page: {},
    choosespec:[],
    specifications:[],
    disable:false,
    count:1,
    buyok:false
  },
  swiper(e){
    this.setData({
      current: e.detail.current
    })
  },
  open1() {
    this.setData({
      visible1: true,
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
  close1() {
    this.setData({
      visible1: false,
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
    this.onClose('visible1')
  },
  onClose2() {
    this.onClose('visible2')
  },
  onClose3() {
    this.onClose('visible3')
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },
  link(e){
    wx.navigateTo({
      url: '../page/index?url=' + e.currentTarget.dataset.url,
    })
  },
  fqtz(){
    wx.navigateTo({
      url: '../page/index?url=' + app.globalData.config.protocol.nper,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  
  onLoad: function (options) {
    var that = this;
    util.loading()
    
    util.getJSON({ apiUrl: apiurl.goods_show + options.id }, function (res) {
      var result = res.data.result
      var choosed1 = [], choosed = []
      for (var i in result.spu_id){
        if (result.spec_values[i]["sku_id"] == result.sku_id){
          choosed1 = result.spec_values[i]["spec_value"]
        }
      }
      for (var n in choosed1){
        choosed.push(choosed1[n])
      }
      that.setData({
        result: result,
        choosed: choosed,
        spu_id: result.spu_id
      })
      that.commentIndex(result.spu_id)
      that._click(choosed, result.spec_values, result)
      util.hideLoading()
    })
    
  },
  commentIndex(spu_id, page=1){
    var that = this;
    util.getJSON({ apiUrl: apiurl.goods_commentIndex + spu_id+"&page="+page }, function (res) {
      var result = res.data.result
      that.setData({
        list: result.list,
        page: result.page
      })
      util.hideLoading()
    })
  },
  // 选择规格时的选项情况
  _click(choosed, spec_values = this.data.result.spec_values, result = this.data.result){
    // var disable = false
    var arr = [],that = this;
    for (var n in choosed) {
      arr[n] = [];
    }
    // 都选时
    for (var a in spec_values) {
      for (var b in spec_values[a].spec_value) {
        if (choosed[b] == spec_values[a].spec_value[b]) {
          // console.log(spec_values[a].spec_value[b])
          for (var c in spec_values[a].spec_value) {
            if (arr[c].indexOf(spec_values[a].spec_value[c]) == -1) {
              arr[c].push(spec_values[a].spec_value[c])
              // console.log(arr[c])
            }
          }
        }
      }
    }
    // console.log(arr)
    //未完全勾选时
    if (choosed.indexOf(-1) != -1) {
      // disable = true
      var num=0
      // 部分未勾选时
      for (var m in choosed) {
        if (choosed[m] != -1)  {
          for (var a in spec_values) {
            if (arr[m].indexOf(spec_values[a].spec_value[m]) == -1) {
              arr[m].push(spec_values[a].spec_value[m])
            }
          }
        }else{
          num=num+1
        }
      }
      // 全部未勾选时
      if (num == choosed.length){
        for (var p in choosed) {
          for (var q in spec_values) {
            if (arr[p].indexOf(spec_values[q].spec_value[p]) == -1) {
              arr[p].push(spec_values[q].spec_value[p])
            }
          }
        }
      }
    }else{
      for (var d in spec_values) {
        if (choosed.toString() == spec_values[d].spec_value.toString() ){
          result.market_price = spec_values[d].market_price 
          result.nper_price = spec_values[d].nper_price 
          result.price = spec_values[d].price 
          result.sku_id = spec_values[d].sku_id 
          result.sku_name = spec_values[d].sku_name 
        }
      }
    }
    
    // console.log(arr)
    that.setData({
      arr: arr,
      result: result
      // disable:disable
    })
  },
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
  
  choose(e) {
    var list = this.data.items
    for (let i in list) {
      list[i].choosed = 0
    }
    list[e.currentTarget.dataset.id]["choosed"] = 1
    this.setData({
      items: list
    })
  },
  choosed(e) {
    var list = this.data.cartArr
    list[e.currentTarget.dataset.id]["choosed"] = !e.currentTarget.dataset.choosed
    this.setData({
      cartArr: list
    })
    
  },
  choosespecs(e){
    if (e.currentTarget.dataset.click==-1){
      return false
    }
    var choosed = this.data.choosed;
    if (choosed[e.currentTarget.dataset.choosed] == e.currentTarget.dataset.spec_value_id){
      choosed[e.currentTarget.dataset.choosed]=-1
    }else{
      choosed[e.currentTarget.dataset.choosed] = e.currentTarget.dataset.spec_value_id
    }
    this.setData({
      choosed: choosed
    })
    this._click(choosed)
  },
  buy(e){
    var that = this;
    if (that.data.choosed.indexOf(-1)!=-1){
      return util.alert("请选择"+that.data.result.specs[that.data.choosed.indexOf(-1)]["spec_name"])
    }
    // console.log(that.data.result.sku_id)
    // console.log(that.data.count)
    var data ={
      buy_type:"now",
      'sku_arr[0][sku_id]': that.data.result.sku_id,
      'sku_arr[0][count]': that.data.count
    }
    that.setData({
      buyok: true
    })
    
    util.postJSON({ apiUrl: apiurl.order_payShow,data:data }, function (res) {
      var result = res.data.result
      console.log(result )
        wx.navigateTo({
          url: '../order_detail/index?result='+ JSON.stringify(result),
      })
      that.setData({
        buyok: false,
        visible1:false
      })
      // that.setData({
      //   buyok: false
      // })
    },function(res){
      that.setData({
        buyok: false
      })
      }, function (res) {
        that.setData({
          buyok: false
        })
      })
  },
  onChange(e) {
    console.log(e.detail.value)
    this.setData({
      count: e.detail.value,
    })
  },
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();

    var that = this;
    util.getJSON({  apiUrl: apiurl.goods_commentIndex + that.spu_id + "&page=" + page}, function (res) {
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
      that.commentIndex(that.spu_id,Number(that.data.page.current_page) + 1)
    } else {
      that.setData({
        last: true
      })
      wx.hideLoading()
    }
  },
})