//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
var link = require('../../utils/link.js');
var template = require('../../Components/tab-bar/tab-bar.js');
var bmap = require('../../utils/bmap-wx.min.js');

Page({
  data: {
    indicatorDots: false, //显示面板指示点
    indicatorDots1:true,
    autoplay: false, //自动播放
    beforeColor: "white", //指示点颜色
    afterColor: "#20CD86", //当前选中的指示点颜色 
    beforeColor1: '#2EB354',
    interval: 10000,
    interval1: 6000,
    duration: 1000,

    indicatorDotstag: true, //显示面板指示点
    autoplaytag: false, //自动播放
    beforeColortag: "#DCDCDC", //指示点颜色
    afterColortag: "#27aad9", //当前选中的指示点颜色
    intervaltag: 11000,
    durationtag: 1000,
    userInfo: {},
    banner: [],
    block: [],
    garbage: [],
    tag: [],
    user: {
      put_count: 0,
      balance: 0.00
    },
    token: "",
    tabbarid: 0,
    share_gene: '',
    ak: util.bmak,
    weatherData: '',
    futureWeather: [],
    imagetq: [
      {
        title: '晴',
        images: '../../images/sun@2x.png'
      },
      {
        
        title: '多云',
        images: '../../images/cloudy@2x.png'
      },
      {
        title: '阴',
        images: '../../images/cloud@2x.png'
      },
      {
        title: '小雨',
        images: '../../images/rain@2x.png'
      },
      {
        title: '大雨',
        images: '../../images/heavy_rain@2x.png'
      },
      {
        title: '雪',
        images: '../../images/heavy_snow@2x.png'
      },
    ],
    shop_cate: [],
    visible1: false,
    value1: [],
    pullState: 1,
    swiperCurrent:0,
    length:0
  },
  search(e) {
    wx.navigateTo({
      url: '../search/index',
    })
  },
  details(e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../installment_details/installment_details?id=' + e.currentTarget.dataset.id
    })
  },
  swiperChange: function (e) {
    // console.log(e.detail.current)
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  onLoad: function(options) {
    var that = this;
    
    this.refreshView = this.selectComponent("#refreshView")
    var formData = wx.getStorageSync('formData')
    this.setData({
      guidel: wx.getStorageSync('guidel')
    })
    if (options.pjurl){
      this.setData({
        pjurl: options.pjurl,
        pjdata: options.pjdata,
      })
    }
    if (formData) {
      this.setData({
        formData: formData
      })
      wx.setStorageSync('formData', '')
    }
    if (app.globalData.config.length == 0){
      util.loading()
    }
    if (wx.getStorageSync('token') && wx.getStorageSync('token') != 1) {
      that.setData({
        token: util.getToken()
      })
      if (options.pjurl) {
        util.pjnav(options.pjurl, options.pjdata)
      }
      that.init()
    } else {
      wx.setStorageSync("token", 1)
      that.setData({
        token: 1
      })
      util.hideLoading()
    }
    if (options.share_gene) { //是否携带参数
      that.setData({
        share_gene: options.share_gene
      })
    }
    

  },
  onShow() {
    this.adr()
  },
  adr() {
    var that = this;
    if (!wx.getStorageSync('token') || wx.getStorageSync('token') == 1) {
      return false
    }
    if (wx.getStorageSync('locAddress')) {
      return this.setData({
        address: wx.getStorageSync('locAddress')
      })
    }
    util.address(function(data) {
      console.log(data)
      util.getJSON({
        apiUrl: apiurl.areaparse + data.address
      }, function(res) {
        wx.setStorageSync("locAddress", res.data.result.list[1]["name"])
        wx.setStorageSync("locAddressID", res.data.result.list[1]["area_id"])
        that.setData({
          area: res.data.result.list[1],
          address: res.data.result.list[1]["name"]
        })
      }, function(e) {
        console.log(e)
      })
    })
  },
  init() {
    
    var that = this;
    util.getJSON({
      apiUrl: apiurl.index
    }, function(res) {
      var result = res.data.result;
      var tag = result.block_arr;
      that.setData({
        // seckill_list: result.seckill_list||'',
        popout_image: result.popout_image||'',
        popout: result.popout_image?1:0,
        // tag: result.tag || '',
        // ru_float: result.ru_float || '',
        // tag_bgi: result.tag_bgi || '',
        // wallet: result.wallet || '',
        // notify: result.notify || '',
        banner_arr: result.banner_arr || '',
        block_arr: result.block_arr || '',
        notify_arr: result.notify_arr || '',
        rail: result.rail || '',
        tag_arr: result.tag_arr || '',
        wallet: result.wallet || '',
      })
      console.log(that.data.popout)
      for (var i in tag ){
        if (tag[i]['control']['key'] =='front_tshop_index'){
          getApp().globalData.front_tshop_index = tag[i]["children"]
          console.log(getApp().globalData.front_tshop_index )
        }
        
      }

      that.initgoods()
      util.hideLoading()
    })
    if (app.globalData.config.length == 0) {
      that.adr()
      util.getJSON({
        apiUrl: apiurl.config
      }, function(res) {
        var result = res.data.result;
        getApp().globalData.config = result;
        that.setData({
          config: res.data.result
        })
      })

    } else {
      util.hideLoading()
      this.setData({
        config: app.globalData.config
      })
    }
  },
  // 操作指南
  guidel(e){

    if (e.detail.data&&e.detail.data.control.control){ 
      util.nav(e.detail.data)
    } else if (e.detail.data.key=="back"){
      wx.setStorageSync('guidel', 1)
    }
    this.setData({
      popout:0
    })
    // console.log(this.data.popout)
  },
  // 天气
  weather() {
    var that = this;
    // 新建bmap对象 
    var BMap = new bmap.BMapWX({
      ak: that.data.ak
    });
    var fail = function(data) {
      // console.log(data);
    };
    var success = function(data) {
      var weatherData = data.currentWeather[0];
      var futureWeather = data.originalData.results[0].weather_data;
      for (var i in that.data.imagetq) {
        if (weatherData.weatherDesc.indexOf(that.data.imagetq[i].title) > -1) {
          futureWeather[0].dayPictureUrl = that.data.imagetq[i].images
        }
      }
      that.setData({
        weatherData: weatherData,
        futureWeather: futureWeather
      });
    }

    // 发起weather请求 
    BMap.weather({
      fail: fail,
      success: success
    });
  },
  image() {

  },
  onReady: function() {
    this.refreshView = this.selectComponent("#refreshView")
    template.tabbar("tabBar", 0, this) //0表示第一个tabbar

  },
  link(e) {

    // console.log(e.currentTarget.dataset.link)
    if (!e.currentTarget.dataset.link || JSON.stringify(e.currentTarget.dataset.link) == "{}") {
      if (e.currentTarget.dataset.open) {
        return wx.navigateTo({
          url: '../unopen/index',
        })
      } else {
        return false
      }

    }
    var url = e.currentTarget.dataset.link.control
    if (JSON.stringify(e.currentTarget.dataset.link.params) != "{}") {
      url = url + "?1=1"
      for (var i in e.currentTarget.dataset.link.params) {

        console.log(i, e.currentTarget.dataset.link.params[i])
        url = url + "&" + i + "=" + e.currentTarget.dataset.link.params[i]
      }
    }
    if (e.currentTarget.dataset.children != '' && e.currentTarget.dataset.children != undefined) {
      url = url + "?children=" + JSON.stringify(e.currentTarget.dataset.children)
    }
    // console.log(url)
    wx.navigateTo({
      url: url,
      fail: function() {
        util.alert('该功能暂未开放，敬请期待')
      },
    })



  },
  shopdetail(e) {
    // console.log(e.currentTarget.dataset.shop_id)
    util.loading()
    wx.navigateTo({
      url: '../business_details/business_details?t_shop_id=' + e.currentTarget.dataset.shop_id,
    })
  },
  show() { //不跳页面
    util.scan()
  },
  bindGetUserInfo(e) {
    wx.setStorageSync("token", 1)
    var that = this;
    if (e.detail.userInfo) {
      util.loading()
      var token = ""
      wx.login({
        success: function(res) {
          var data = {
            wx_code: res.code,
            wx_appid: util.wx_appid
          }
          if (res.code) {
            util.postJSON({
              apiUrl: apiurl.wechatLetAttemptLogin,
              data: data,
              token: "huhu"
            }, function(res1) {
              if (res1.data.result.token) {
                wx.setStorageSync("token", res1.data.result.token)
                token = res1.data.result.token
                that.setData({
                  token: token
                })
                if (that.data.pjurl) {
                 return util.pjnav(that.data.pjur, that.data.pjdata)
                }
                // console.log(that.data.formData)
                if (that.data.formData && that.data.formData.hasOwnProperty("qrcode")) {
                  wx.setStorageSync('formData', '')
                  wx.navigateTo({
                    url: '../qrcode/index?q=' + that.data.formData["qrcode"],
                  })
                }
                return that.init()
              } else {
                wx.getUserInfo({
                  success(res2) {
                    util.postJSON({
                      apiUrl: apiurl.wechatLetLogin,
                      data: {
                        wx_appid: util.wx_appid,
                        share_gene: that.data.share_gene,
                        session_key: util.base64encode(util.utf16to8(res1.data.result.wx_user.session_key)),
                        iv: util.base64encode(util.utf16to8(res2.iv)),
                        encrypt_data: util.base64encode(util.utf16to8(res2.encryptedData))
                      },
                      token: "huhu"
                    }, function(res3) {
                      wx.setStorageSync("token", res3.data.result.token)
                      console.log(wx.getStorageSync('token'))
                      token = res3.data.result.token
                      that.setData({
                        token: token
                      })
                      if (that.data.pjurl) {
                        return util.pjnav(that.data.pjur, that.data.pjdata)
                      }
                      // console.log(that.data.formData)
                      if (that.data.formData && that.data.formData.hasOwnProperty("qrcode")) {
                        // wx.sStorageSync('formData')
                        wx.setStorageSync('formData', '')
                        wx.navigateTo({
                          url: '../qrcode/index?q=' + that.data.formData["qrcode"],
                        })
                      }
                      return that.init()
                    })
                  }
                })
              }
            }, function() {
              util.alert('授权失败')
            }, function() {
              util.alert('授权失败')
            })
          }
        },
        fail(w) {
          util.alert('授权失败')
        }
      })
    } else {
      // util.alert("为了您更好的体验,请先同意授权")
      console.log(e)
    }

  },
  tabarUrl(e) {
    if (this.data.tabbarid != e.currentTarget.dataset.id) {
      wx.reLaunch({
        url: e.currentTarget.dataset.url,
      })
    }
  },
  agriculturalLink(e) {
    wx.navigateTo({
      url: '../installment_details/installment_details?id=' + e.currentTarget.dataset.sku_id
    })
  },
  seckill(e) {
    wx.navigateTo({
      url: '../agriculturalDetail/index?id=' + e.currentTarget.dataset.sku_id
    })
  },
  // onPullDownRefresh: function() {
  //   // 显示顶部刷新图标
  //   wx.showNavigationBarLoading();
  //   var that = this;
  //   this.setData({
  //     pullState: 0
  //   })
  //   setTimeout(function() {
  //     that.setData({
  //       pullState: 1
  //     })
  //     wx.hideNavigationBarLoading();
  //     wx.stopPullDownRefresh();
  //   }, 1500)
  // },
  goarea() {
    wx.navigateTo({
      url: '../area/index',
    })
  },
  initgoods(page = 1) {
    var that = this;

    util.getJSON({
      apiUrl: apiurl.goods + "?page=" + page + "&source=online"
    }, function (res) {
      var result = res.data.result
      var list = result.list
      if (page != 1) {
        list = that.data.list.concat(list)
      }
      that.setData({
        list: list,
        page: result.page,
        last: false,
        length: Math.ceil(list.length / 4)
      })
      util.hideLoading()
    })
  },
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();

    var that = this;
    util.getJSON({
      apiUrl: apiurl.goods + "?page=" + 1 + "&source=online"
    }, function (res) {
      var result = res.data.result
      var list = result.list
      that.setData({
        list: list,
        page: result.page,
        last: false,
        length: Math.ceil(list.length / 4)
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
    console.log(11111111111)
    // 页数+1
    if (Number(that.data.page.current_page) != Number(that.data.page.last_page)) {
      that.initgoods(Number(that.data.page.current_page) + 1)
    } else {
      that.setData({
        last: true
      })
      wx.hideLoading()
    }
  },
})
// ,
//   "enablePullDownRefresh": true