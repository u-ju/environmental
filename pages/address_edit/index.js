// pages/address_edit/index.js
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
    url: 'shippingAddress_store'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.item){
      var item = JSON.parse(options.item)
      this.setData({
        item: item,
        name: item.name,
        phone: item.phone,
        areaSelectedStr: item.area_name,
        address: item.address,
        area_id:item.area_id,
        url: 'shippingAddress_update',
        address_id: item.address_id
      })
      
    }
  },
  formSubmit(e){
    console.log(e)
    var data = e.detail.value,that = this;
    data.area_id = that.data.area_id_val
    that.setData({
      disabled:true
    })
    if (that.data.item || that.data.item.length>0){
      data['address_id'] = that.data.address_id
    }
    util.postJSON({apiUrl: apiurl[that.data.url] ,data:data},
     function (res) {
      var result = res.data.result;
       wx.hideLoading()
       util.alert(res.data.message)
       util.navigateBack()
    },function (){
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
    this.setData({
      areaSelectedStr: e.detail.areaSelectedStr,
      area_id_val: e.detail.area_id_val
    })
  },
})
