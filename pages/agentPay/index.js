// pages/agentPay/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
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
    area_id: '',
    maskVisual: 'hidden',
    provinceName: '请选择',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.loadAddress();
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
  // 支付
  open2() {
    var that = this;
    if (!that.data.area_id){
      return util.alert("请选择区域")
    }
    util.postJSON({ apiUrl: apiurl.create, data: { pay_source: "agent", area_id: that.data.area_id } },
      function (res) {
        var result = res.data.result
        console.log(res)

        for (let i in result.payment_usable) {
          result.payment_usable[i].choosed = 0
        }
        result.payment_usable[0].choosed = 1
        that.setData({
          result: result,
          payment_usable: result.payment_usable,
          pay_amount: result.pay_amount,
          visible2: true,
          payment: result.payment_usable[0]["key"]
        })
      })

  },
  choose(e) {
    var result = this.data.result;
    for (let i in result.payment_usable) {
      result.payment_usable[i].choosed = 0
      if (result.payment_usable[i].options && this.data.payment_ext) {
        for (let a in result.payment_usable[i].options) {
          result.payment_usable[i].options[a].choosed = 0
        }
      }
    }
    var payment_ext = '';
    result["payment_usable"][e.currentTarget.dataset.index]["choosed"] = 1
    var pay_amount = result.pay_amount
    this.setData({
      result: result,
      fq: e.currentTarget.dataset.index,
      payment_ext: payment_ext,
      pay_amount: pay_amount,
      payment: result["payment_usable"][e.currentTarget.dataset.index]["key"]
    })
  },
  onClose2(){
    var that = this;
    that.setData({
      visible2: false,
    })
  },
  close2() {
    var that = this;
    that.setData({
      visible2: false,
    })
    wx.showLoading({
      title: '加载中',
    })
    util.postJSON({ apiUrl: apiurl.vendor, data: { pay_key: that.data.result.pay_key, payment: that.data.payment, pay_amount: that.data.result.pay_amount, pay_cash: that.data.result.pay_amount } },
      function (res) {
        var result = res.data.result
        console.log(res)
        if (result.payment == "balance") {
          util.postJSON({ apiUrl: apiurl.query, data: { pay_key: result.pay_key } }, function (res2) {
            util.alert("支付成功")
            wx.showLoading({
              title: '加载中',
            })
            util.navigateBack(1)
          }, function () {
            wx.navigateTo({
              url: '../error/error',
            })
          }, function () {
            wx.navigateTo({
              url: '../error/error',
            })
          })
        } else {
          wx.requestPayment({
            timeStamp: result.pay_info.timeStamp,
            nonceStr: result.pay_info.nonceStr,
            package: result.pay_info.package,
            signType: result.pay_info.signType,
            paySign: result.pay_info.paySign,
            success(res1) {
              console.log(res1)
              wx.hideLoading()
              util.postJSON({ apiUrl: apiurl.query, data: { pay_key: result.pay_key } }, function (res2) {
                wx.showLoading({
                  title: '加载中',
                })
                util.alert("支付成功")
                util.navigateBack(1)
              }, function () {
                wx.navigateTo({
                  url: '../error/error',
                })
              }, function () {
                wx.navigateTo({
                  url: '../error/error',
                }) 
              })
            },
            fail(res) {
              util.alert("支付失败")
            }
          })
        }


      })
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
      console.log(array, area)
      if (area[0].type == "town") {
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
    wx.setStorageSync('areaSelectedStrt', areaSelectedStr)
    wx.setStorageSync('area_idt', that.data.townObjects[index]["area_id"])
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})