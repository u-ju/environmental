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
    indicatorDots: false,//显示面板指示点
    autoplay: true,//自动播放
    beforeColor: "white",//指示点颜色
    afterColor: "coral",//当前选中的指示点颜色
    beforeColor1:'#2EB354',
    interval: 10000,
    interval1: 6000,
    duration: 1000,

    indicatorDotstag: true,//显示面板指示点
    autoplaytag: false,//自动播放
    beforeColortag: "#DCDCDC",//指示点颜色
    afterColortag: "#27aad9",//当前选中的指示点颜色
    intervaltag: 11000,
    durationtag: 1000,

    userInfo: {},
    banner: [],
    block: [],
    garbage: [
      
      ],
    tag: [
      
      ],
    user: { put_count: 0, balance:0.00},
    token:"",
    tabbarid:0,
    share_gene:'',
    
    ak: "DebUHwMKH2yOlHOHlXiVlZTeCuFnRgZo",
    weatherData: '',
    futureWeather: [],
    imagetq:[
      { title: '晴', images: '../../images/sun@2x.png' },
      { title: '多云', images: '../../images/cloudy@2x.png' },
      { title: '阴', images: '../../images/cloud@2x.png' },
      { title: '小雨', images: '../../images/rain@2x.png' },
      { title: '大雨', images: '../../images/heavy_rain@2x.png' },
      { title: '雪', images: '../../images/heavy_snow@2x.png' },
    ],
    shop_cate:[],
    visible1:false,
    value1:[],
    pullState:1
  },
  search(e) {
    wx.navigateTo({
      url: '../search/index',
    })
  },

  onLoad: function (options) {
    var that  = this;
    this.refreshView = this.selectComponent("#refreshView")
    var formData = wx.getStorageSync('formData')
    if (formData){
      this.setData({
        formData: formData
      })
      wx.setStorageSync('formData', '')
    }
    
    
    util.loading()
    if (wx.getStorageSync('token') && wx.getStorageSync('token')!=1){
      that.setData({
        token: util.getToken()
      })
      that.init()
    }else{
      wx.setStorageSync("token",1)
      that.setData({
        token: 1
      })
      util.hideLoading()
    }
    if (options.share_gene) {//是否携带参数
      that.setData({
        share_gene: options.share_gene
      })
    }
    if (options.pjurl) {//是否携带参数
      that.setData({
        pjurl: options.pjurl
      })
    }
    
  },
  onShow(){
    this.adr()
  },
  adr(){
    var that = this;
    if (!wx.getStorageSync('token') || wx.getStorageSync('token') == 1) {
      return false
    }
    console.log(wx.getStorageSync('token'))
    if (wx.getStorageSync('locAddress')) {
      return this.setData({
        address: wx.getStorageSync('locAddress')
      })
    }
    util.address(function (data) {
      console.log(data)
      util.getJSON({ apiUrl: apiurl.areaparse + data.address }, function (res) {
        wx.setStorageSync("locAddress", res.data.result.list[1]["name"])
        wx.setStorageSync("locAddressID", res.data.result.list[1]["area_id"])
        that.setData({
          area: res.data.result.list[1],
          address: res.data.result.list[1]["name"]
        })
      }, function (e) {
        console.log(e)
      })
    })
  },
  init(){
    var that =this;
    util.getJSON({ apiUrl: apiurl.index }, function (res) {
      var result = res.data.result;
      var tag = result.tag;
      that.setData({
        result: result,
        banner: result.banner,
        shop_ad: result.shop_ad,
        tag: tag,
        user: result.user,
        shop_goods_ad: result.shop_goods_ad,
        taglen: Math.ceil(tag.length / 8)
      })
      util.hideLoading()
    })
    that.adr()
    if (app.globalData.config.length==0){
      util.getJSON({ apiUrl: apiurl.config }, function (res) {
        var result = res.data.result;
        getApp().globalData.config = result;
        that.setData({
          config: res.data.result
        })
      })
      
    }else{
      this.setData({
        config: app.globalData.config
      })
    }
  },
  weather(){
    var that = this;
    // 新建bmap对象 
    var BMap = new bmap.BMapWX({
      ak: that.data.ak
    });
    var fail = function (data) {
      // console.log(data);
    };
    var success = function (data) {
      var weatherData = data.currentWeather[0];
      var futureWeather = data.originalData.results[0].weather_data;
      for(var i in  that.data.imagetq){
        if (weatherData.weatherDesc.indexOf(that.data.imagetq[i].title)>-1){
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
  onReady:function(){
    this.refreshView = this.selectComponent("#refreshView")
    template.tabbar("tabBar",0, this) //0表示第一个tabbar
    
  },
  link(e){
    
    // console.log(e.currentTarget.dataset.link)
    if (!e.currentTarget.dataset.link||JSON.stringify(e.currentTarget.dataset.link) == "{}"){
      if (e.currentTarget.dataset.open){
        return wx.navigateTo({
          url: '../unopen/index',
        })
      }else{
        return false
      }
      
    }
    var url = e.currentTarget.dataset.link.control
    if (JSON.stringify(e.currentTarget.dataset.link.params) != "{}") {
      url = url + "?1=1"
      for (var i in e.currentTarget.dataset.link.params){
        
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
      fail: function () {
        util.alert('该功能暂未开放，敬请期待')
      },
    })
    
   
    
  },
  shopdetail(e){
    // console.log(e.currentTarget.dataset.shop_id)
    util.loading()
    wx.navigateTo({
      url: '../business_details/business_details?t_shop_id=' + e.currentTarget.dataset.shop_id,
    })
  },
  show(){//不跳页面
    util.scan()
  },
  bindGetUserInfo(e) {
    wx.setStorageSync("token", 1)
    var that = this;
    if (e.detail.userInfo) {
      util.loading()
      var token = ""
      wx.login({
        success: function (res) {
          var data = { wx_code: res.code, wx_appid: 'wx312b45ec2ec4d345'}
          if (res.code) {
            util.postJSON({ apiUrl: apiurl.wechatLetAttemptLogin, data: data, token: "huhu" }, function (res1) {
              if (res1.data.result.token) {
                wx.setStorageSync("token", res1.data.result.token)
                token = res1.data.result.token
                that.setData({
                  token: token
                })
                if (that.data.pjurl){
                  return wx.navigateTo({
                    url: that.data.pjurl,
                  })
                } 
                // console.log(that.data.formData)
                if (that.data.formData&&that.data.formData.hasOwnProperty("qrcode")){
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
                        wx_appid: 'wx312b45ec2ec4d345',
                        share_gene: that.data.share_gene,
                        session_key: util.base64encode(util.utf16to8(res1.data.result.wx_user.session_key)),
                        iv: util.base64encode(util.utf16to8(res2.iv)),
                        encrypt_data: util.base64encode(util.utf16to8(res2.encryptedData))
                      }, token: "huhu"
                    }, function (res3) {
                      wx.setStorageSync("token", res3.data.result.token)
                      console.log(wx.getStorageSync('token'))
                      token = res3.data.result.token
                      that.setData({
                        token: token
                      })
                      if (that.data.pjurl) {
                        return wx.navigateTo({
                          url: that.data.pjurl,
                        })
                      }
                      // console.log(that.data.formData)
                      if (that.data.formData &&that.data.formData.hasOwnProperty("qrcode")) {
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
            },function(){
              util.alert('授权失败')
              }, function () {
                util.alert('授权失败')
              })
          }
        },
        fail(w){
          util.alert('授权失败')
        }
      })
      
      
      
      
    }else{
      util.alert("为了您更好的体验,请先同意授权")
      
    }
    
  },
  tabarUrl(e){
    if (this.data.tabbarid != e.currentTarget.dataset.id){
      wx.reLaunch({
        url: e.currentTarget.dataset.url,
      })
    }
  },
  agriculturalLink(e){
    console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: '../installment_details/installment_details?id=' + e.currentTarget.dataset.sku_id
    })
  },
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    this.setData({
      pullState:0
    })
    // util.getJSON({ apiUrl: apiurl.list + "?cate_id=" + that.data.cate_id + "&page=1" }, function (res) {
    //   var result = res.data.result
    //   console.log(result)
    //   that.setData({
    //     list: result.list,
    //     page: result.page,
    //     last: false
    //   })
      // 隐藏导航栏加载框
      // wx.hideNavigationBarLoading();
      // 停止下拉动作
      // wx.stopPullDownRefresh();
    // })
    setTimeout(function(){
      that.setData({
        pullState: 1
      })
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    },1500)
  },
  goarea(){
    wx.navigateTo({
      url: '../area/index',
    })
  },
  //触摸开始
  // handletouchstart: function (event) {
  //   this.refreshView.handletouchstart(event)
  // },
  // //触摸移动
  // handletouchmove: function (event) {
  //   this.refreshView.handletouchmove(event)
  // },
  // //触摸结束
  // handletouchend: function (event) {
  //   this.refreshView.handletouchend(event)
  // },
  // //触摸取消
  // handletouchcancel: function (event) {
  //   this.refreshView.handletouchcancel(event)
  // },
  // //页面滚动
  // onPageScroll: function (event) {
  //   this.refreshView.onPageScroll(event)
  // },
  // onPullDownRefresh: function () {
  //   setTimeout(() => { this.refreshView.stopPullRefresh() }, 1000)
  // }
})
// ,
//   "enablePullDownRefresh": true