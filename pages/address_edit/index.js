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
    province: [],
    city: [],
    region: [],
    town: [],
    provinceObjects: [],
    cityObjects: [],
    regionObjects: [],
    townObjects: [],
    areaSelectedStr: '',
    area_id_val: 0,
    maskVisual: 'hidden',
    provinceName: '请选择',
    disabled: false,
    item:'',
    url:'shippingAddress_store'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadAddress();
    if (options.item){
      var item = JSON.parse(options.item)
      this.setData({
        item: item,
        name: item.name,
        phone: item.phone,
        areaSelectedStr: item.area_name,
        address: item.address,
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
      data['area_id'] = that.data.item.area_id
    }
    util.postJSON({apiUrl: apiurl[that.data.url] ,data:data},
     function (res) {
      var result = res.data.result;
       wx.hideLoading()
       util.deplay_navigateTo("../address/index")
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
  //更新顶部展示的数据
  updateShowData: function (e) {
    item = this.data.item;
    this.setData({
      province: item.provinces[item.value[0]].name,
      city: item.citys[item.value[1]].name,
      county: item.countys[item.value[2]].name
    });
  },
  // 地区选择
  loadAddress: function (options) {
    var that = this;
    this.getArea(0, function (array, area) {
      that.setData({
        province: array,
        provinceObjects: area
      });
    });
  },
  cascadePopup: function () {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-in-out',
    });
    this.animation = animation;
    animation.translateY(-285).step();
    this.setData({
      animationData: this.animation.export(),
      maskVisual: 'show'
    });
  },
  cascadeDismiss: function () {
    this.animation.translateY(285).step();
    this.setData({
      animationData: this.animation.export(),
      maskVisual: 'hidden'
    });
  },
  provinceTapped: function (e) {
    // 标识当前点击省份，记录其名称与主键id都依赖它
    var index = e.currentTarget.dataset.index;
    // current为1，使得页面向左滑动一页至市级列表
    // provinceIndex是市区数据的标识
    this.setData({
      provinceName: this.data.province[index],
      regionName: '',
      townName: '',
      provinceIndex: index,
      cityIndex: -1,
      regionIndex: -1,
      townIndex: -1,
      region: [],
      town: []
    });
    var that = this;
    this.getArea(this.data.provinceObjects[index]["area_id"], function (array, area) {
      that.setData({
        cityName: '请选择',
        city: array,
        cityObjects: area
      });
      that.setData({
        current: 1
      });
    });
  },
  cityTapped: function (e) {
    // 标识当前点击县级，记录其名称与主键id都依赖它
    var index = e.currentTarget.dataset.index;
    // current为1，使得页面向左滑动一页至市级列表
    // cityIndex是市区数据的标识
    this.setData({
      cityIndex: index,
      regionIndex: -1,
      townIndex: -1,
      cityName: this.data.city[index],
      regionName: '',
      townName: '',
      town: []
    });
    var that = this;
    this.getArea(this.data.cityObjects[index]["area_id"], function (array, area) {
      if (area.length == 0) {
        var areaSelectedStr = that.data.provinceName + that.data.cityName;
        that.setData({
          areaSelectedStr: areaSelectedStr,
          area_id_val: that.data.cityObjects[index]["area_id"]
        });
        that.cascadeDismiss();
        return;
      }
      that.setData({
        regionName: '请选择',
        region: array,
        regionObjects: area
      });
      // 确保生成了数组数据再移动swiper
      that.setData({
        current: 2
      });
    });
  },
  regionTapped: function (e) {
    // 标识当前点击镇级，记录其名称与主键id都依赖它
    var index = e.currentTarget.dataset.index;
    // current为1，使得页面向左滑动一页至市级列表
    // regionIndex是县级数据的标识
    this.setData({
      regionIndex: index,
      townIndex: -1,
      regionName: this.data.region[index],
      townName: ''
    });
    var that = this;
    this.getArea(this.data.regionObjects[index]["area_id"], function (array, area) {
      if (area.length == 0) {
        var areaSelectedStr = that.data.provinceName + that.data.cityName + that.data.regionName;
        that.setData({
          areaSelectedStr: areaSelectedStr,
          area_id_val: that.data.regionObjects[index]["area_id"]
        });
        that.cascadeDismiss();
        return;
      }
      that.setData({
        townName: '请选择',
        town: array,
        townObjects: area
      });
      // 确保生成了数组数据再移动swiper
      that.setData({
        current: 3
      });
    });
  },
  townTapped: function (e) {
    // 标识当前点击镇级，记录其名称与主键id都依赖它
    var index = e.currentTarget.dataset.index;
    var that = this;
    // townIndex是镇级数据的标识
    this.setData({
      townIndex: index,
      townName: this.data.town[index]
    });
    var areaSelectedStr = this.data.provinceName + this.data.cityName + this.data.regionName + this.data.townName;
    this.setData({
      areaSelectedStr: areaSelectedStr,
      area_id_val: that.data.townObjects[index]["area_id"]
    });
    this.cascadeDismiss();
  },
  currentChanged: function (e) {
    // swiper滚动使得current值被动变化，用于高亮标记
    var current = e.detail.current;
    this.setData({
      current: current
    });
  },
  changeCurrent: function (e) {
    // 记录点击的标题所在的区级级别
    var current = e.currentTarget.dataset.current;
    this.setData({
      current: current
    });
  },
  getArea: function (pid, cb) {
    var that = this;
    wx.request({
      url: apiurl.area + pid, //仅为示例，并非真实的接口地址

      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var area = res.data.result.list, array = []
        for (var i = 0; i < area.length; i++) {
          array[i] = area[i]['name'];
        }
        cb(array, area)
      }
    })
  }
})
