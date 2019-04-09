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
    biotope_name:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.area_id){
      var area_name = options.area_name.split(" "), areaSelectedStr = '', biotope_name=''
      for (var i in area_name){
        console.log(area_name[i])
        if (i == area_name.length-1){
          biotope_name = area_name[i]
        }else{
          areaSelectedStr = areaSelectedStr +' '+ area_name[i]
        }
      }
      this.setData({
        area_id_val: options.area_id,
        areaSelectedStr: areaSelectedStr,
        biotope_name: biotope_name,
      })
    }
  },
  formSubmit(e) {
    console.log(e)
    var data = e.detail.value, that = this;
    data.area_id = that.data.area_id_val
    
    that.setData({
      disabled: true
    })
    
    util.postJSON({ apiUrl: apiurl.areaUpdate, data: data },
      function (res) {
        var result = res.data.result;
        util.alert(res.data.message)
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
    console.log(e)
    var areaSelectedStr = e.detail.areaSelectedStr
    if (e.detail.biotope_name&&areaSelectedStr.indexOf(e.detail.biotope_name)>-1){
      console.log(areaSelectedStr)
      areaSelectedStr = areaSelectedStr.split(e.detail.biotope_name)[0]
    }
    console.log(areaSelectedStr)
    this.setData({
      areaSelectedStr: areaSelectedStr,
      area_id_val: e.detail.area_id_val,
      biotope_name: e.detail.biotope_name
    })
  },
})
