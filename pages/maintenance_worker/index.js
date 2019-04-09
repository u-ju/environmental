// pages/maintenance_worker/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visible3:false,
    // 地址
    current: 0,
    province: [],
    city: [],
    region: [],
    town: [],
    provinceObjects: [],
    cityObjects: [],
    regionObjects: [],
    townObjects: [],
    areaSelectedStr: '',
    area_id: 0,
    maskVisual: 'hidden',
    provinceName: '请选择',
    status_name:'',
    url:'repair_userStore',
    post:false,
    image: [
      { title: '店招上传', upload_picture_list: [], text: "点击拍摄/上传图片", id: 0 },
      { title: '营业执照', upload_picture_list: [], text: "点击拍摄/上传图片", id: 1 },
    ],
    textareahidden:false,
    intro:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  show(){
    this.setData({
      textareahidden: 1
    })
  },
  unshow() {
    this.setData({
      textareahidden: false
    })
  },
  input(e) {
    this.setData({
      intro: e.detail.value
    })
  },
  onLoad: function (options) {
    if (options.repair != '' && options.repair !=undefined){
      this.userShow(options.repair)
      
    } 
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: (res) => {
        let latitude = res.latitude;
        let longitude = res.longitude;
        this.setData({
          longitude: longitude,
          latitude: latitude,
        })
      }
    });
    // this.loadAddress();
    this.tab()
  },
  userShow(id){
    var that = this;
    util.getJSON({ apiUrl: apiurl.repair_userShow + id }, function (res) {
      var result = res.data.result
      that.setData({
        cate_name: result.cate_name,
        cate_id: result.cate_id,
        areaSelectedStr: result.area_name,
        area_id: result.area_id,
        name: result.name,
        phone: result.phone,
        intro: result.intro,
        status_name: result.status_name,
        url:'repair_userUpdate',
        repair_id: id
      })
      wx.hideLoading()
    })
  },
  tab() {
    var that = this;
    util.getJSON({ apiUrl: apiurl.repair_home }, function (res) {
      var cate_arr = res.data.result.cate_arr
      for (var i in cate_arr) {
        cate_arr[i]["value"] = cate_arr[i]["id"]
        cate_arr[i]["label"] = cate_arr[i]["name"]
      }
      that.setData({
        cate_arr: cate_arr,
      })
      wx.hideLoading()
    })
    
  },
  formSubmit(e){
    console.log(e)
    var data = e.detail.value, that = this;
    data.area_id = that.data.area_id
    data.cate_id = that.data.cate_id
    that.setData({
      post: true
    })
    data["intro"] = this.data.intro
    if (that.data.url =='repair_userUpdate'){
      data['repair_id'] = that.data.repair_id
    }
    util.postJSON({ apiUrl: apiurl[that.data.url], data: data }, function (res) {
      util.alert(res.data.message)
      setTimeout(function(){
        wx.reLaunch({
          url: '../index/index',
          success() {
            that.setData({
              visible3: true,
              post: false
            })
          }
        })
      },3000)
    }, function (res) {
      console.log(res.data.message)
      // if (res.data.message == "更新成功") {
      //   // wx.navigateBack()
      // }
      that.setData({
        post: false
      })
      }, function (res) {
        
        that.setData({
          post: false
        })
      })
  },
  choosearea(e) {
    console.log(e)
    this.setData({
      areaSelectedStr: e.detail.areaSelectedStr,
      area_id: e.detail.area_id_val
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
  onOpen1() {
    console.log("sssss")
    this.setData({ visible1: true })
  },
  onClose1() {
    this.setData({ visible1: false })
  },
  onChange1(e) {
    this.setData({ cate_name: e.detail.options.map((n) => n.label).join('-'), cate_id: e.detail.options[e.detail.options.length - 1].id })
    console.log('onChange1', e.detail)
  },
  open3() {
    this.setData({
      visible3: true,
    })
  },
  close3() {
    this.setData({
      visible3: false,
    })
    wx.navigateBack()
  },
  
  xiugai() {
    this.setData({
      disabled1: false
    })
  },
})