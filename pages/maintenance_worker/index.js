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
    this.loadAddress();
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
        cate_arr[i]["value"] = cate_arr[i]["cate_id"]
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
      that.setData({
        visible3: true,
        post: false
      })
      wx.reLaunch({
        url:'../index/index'
      })
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
    this.setData({ cate_name: e.detail.options.map((n) => n.label).join('-'), cate_id: e.detail.options[e.detail.options.length - 1].cate_id })
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
  // 地区选择
  loadAddress: function (options) {
    var that = this;
    util.hideLoading()
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
          area_id: that.data.cityObjects[index]["area_id"]
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
          area_id: that.data.regionObjects[index]["area_id"]
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
      area_id: that.data.townObjects[index]["area_id"]
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
    // console.log(pid)
    wx.request({
      url: apiurl.area + pid, //仅为示例，并非真实的接口地址

      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        // console.log(res.data)
        var area = res.data.result.list, array = []
        for (var i = 0; i < area.length; i++) {
          array[i] = area[i]['name'];
        }
        cb(array, area)
      }
    })
  },
  xiugai() {
    this.setData({
      disabled1: false
    })
  },
})