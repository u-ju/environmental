// pages/myCommunity/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
var Promise = require('../../utils/es6-promise.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 地址
    current: 0,
    areaSelectedStr: '',
    area_id_val: 0,
    disabled: false,
    item: '',
    url: 'shippingAddress_store',
    biotope_name:'',
    dong_name:'',
    unit_name:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (options.area_arr){
      var area_arr = JSON.parse(options.area_arr), areaSelectedStr = '', biotope_name = '', dong_name = '', unit_name = '', province = '', city = '', county = '', buurt = '', town = ''
      // console.log(area_arr)
      for (var i in area_arr){
        if (area_arr[i]['type'] == 'province') {
          province = area_arr[i]['name']
        }
        if (area_arr[i]['type'] == 'city') {
          city = area_arr[i]['name']
        }
        if (area_arr[i]['type'] == 'county') {
          county = area_arr[i]['name']
        }
        if (area_arr[i]['type'] == 'town') {
          town = area_arr[i]['name']
        }
        if (area_arr[i]['type'] == 'buurt') {
          buurt = area_arr[i]['name']
        }
        if (area_arr[i]['type'] =='biotope'){
          biotope_name = area_arr[i]['name']
        }
        if (area_arr[i]['type'] == 'dong') {
          dong_name = area_arr[i]['name'].replace(/[^0-9]/ig, "")
        }
        if (area_arr[i]['type'] == 'unit') {
          unit_name = area_arr[i]['name'].replace(/[^0-9]/ig, "")
        }
        
      }
      var area_id_val = area_arr[area_arr.length - 1] && area_arr[area_arr.length - 1]["id"]? area_arr[area_arr.length - 1]["id"]:''
      this.setData({
        area_id_val: area_id_val,
        areaSelectedStr: province + city + county + town + buurt,
        biotope_name: biotope_name,
        dong_name: dong_name,
        unit_name: unit_name,
        
        
      })
    }
    var door_num = options.door_num
    if (door_num == 'null'){
      door_num=''
    }
    
    this.setData({
      door_num: door_num,
      desc: getApp().globalData.desc
    })
  },
  formSubmit(e) {

    var data = e.detail.value, that = this;
    data.area_id = that.data.area_id_val
    that.setData({
      disabled: true
    })
    util.postJSON({ apiUrl: apiurl.areaUpdate, data: data },
      function (res) {
        var result = res.data.result;
        util.alert(res.data.message)
        that.setData({
          disabled: false
        })
        util.navigateBack()
      }, function () {
        that.setData({
          disabled: false
        })
      }, function () {
        that.setData({
          disabled: false
        })
      })
  },
  choosearea(e) {
    
    var areaSelectedStr = e.detail.areaSelectedStr
    if (e.detail.biotope_name&&areaSelectedStr.indexOf(e.detail.biotope_name)>-1){
      
      areaSelectedStr = areaSelectedStr.split(e.detail.biotope_name)[0]
    }
    this.setData({
      areaSelectedStr: areaSelectedStr,
      area_id_val: e.detail.area_id_val,
      biotope_name: e.detail.biotope_name,
      dong_name: e.detail.dong.replace(/[^0-9]/ig, ""),
      unit_name: e.detail.unit.replace(/[^0-9]/ig, ""),
    })
  },
})
