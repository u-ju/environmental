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
    specifications:[]
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
    console.log('onClose')
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
  /**
   * 生命周期函数--监听页面加载
   */
  
  onLoad: function (options) {
    var that = this;

    util.getJSON({ apiUrl: apiurl.goods_show + options.sku_id }, function (res) {
      var result = res.data.result
      that.setData({
        result: result
      })
      util.hideLoading()
    })
  },
  commentIndex(){
    util.getJSON({ apiUrl: apiurl.goods_commentIndex +"?sku_id="+ options.sku_id }, function (res) {
      var result = res.data.result
      that.setData({
        list: result.list,
        page: result.page
      })
      util.hideLoading()
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
  calling: function (e) {//拨打电话
    console.log(e.target.dataset.phone)
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.phone, //此号码并非真实电话号码，仅用于测试
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  location() {
    var that = this;
    var result = that.data.result;
    var data = {
      latitude: result.latitude,
      longitude: result.longitude,
      address: result.address,
      area_name: result.area_name,
    }
    wx.navigateTo({
      url: '../delivery_station/delivery_station?data=' + JSON.stringify(data),
    })
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
    console.log(e.currentTarget.dataset.spec_value_id)
    console.log(this.data.result.spec_values)
    var specs = this.data.result.specs
    // var spec_values = this.data.result.spec_values
    // for (var i in spec_values){
    //   if (spec_values[i].spec_value.indexOf(e.currentTarget.dataset.spec_value_id)!=-1){
    //     this.setData({
    //       choosespec: spec_values[i].spec_value
    //     })
    //   }
    // }
    for (var i in specs){
      if (specs[i].spec_id == e.currentTarget.dataset.spec_id){
        for (var a in specs[i].spec_values){
          specs[i].spec_values[a]["active"]=0
        }
        specs[i].spec_values[e.currentTarget.dataset.index]["active"] = !specs[i].spec_values[e.currentTarget.dataset.index]["active"]
      }
    }
    this.setData({
      "result.specs": specs
    })
  },
  
})