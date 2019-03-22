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
    indicatorDots: true,//显示面板指示点
    autoplay: true,//自动播放
    beforeColor: "white",//指示点颜色
    afterColor: "coral",//当前选中的指示点颜色
    beforeColor1:'#2EB354',
    interval: 5000,
    interval1: 6000,
    duration: 1000,
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
    value1:[]
  },
  search(e) {
    wx.navigateTo({
      url: '../search/index',
    })
  },
  // searchSubmit(e) {
  //   var keywords = "&keywords=" + this.data.search
  //   this.setData({
  //     keywords: keywords
  //   })
    
  // },
  onLoad: function (options) {
    console.log(options)
    var that  = this;
    console.log(wx.getStorageSync('formData'))
    var formData = wx.getStorageSync('formData')
    this.setData({
      formData: formData
    })
    // var str = '2012-2-2'
    // var str2 = str.replace(/-/g, '/');
    // console.log(str2)
    // wx.setStorageSync('tabbarmainid', '')
    util.loading()
    if (wx.getStorageSync('token')){
      that.setData({
        token: util.getToken()
      })
      that.init()
    }else{
      wx.setStorageSync("token",'')
      that.setData({
        token: ''
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
    that.weather()
    
  },
  init(){
    var that =this;
    util.getJSON({ apiUrl: apiurl.index }, function (res) {
      var result = res.data.result
      that.setData({
        result: result,
        banner: result.banner,
        block: result.block,
        shop_ad: result.shop_ad,
        tag: result.tag,
        user: result.user
      })
      util.hideLoading()
    })
    // that.setData({
    //   shop_cate: getApp().globalData.config.shop_cate
    // })
    if (app.globalData.config.length==0){
      util.getJSON({ apiUrl: apiurl.config }, function (res) {
        var result = res.data.result;
        getApp().globalData.config = result;
        
      })
    }
    if (app.globalData.controlContrast.length == 0) {
      util.getJSON({ apiUrl: apiurl.controlContrast }, function (res) {
        var result = res.data.result;
        getApp().globalData.controlContrast = result;

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
    template.tabbar("tabBar",0, this) //0表示第一个tabbar
    
  },
  link(e){
    var controlContrast = getApp().globalData.controlContrast,url='';
    for (var i in controlContrast){
      if (controlContrast[i].control == e.currentTarget.dataset.link){
        url = controlContrast[i].contrast
        
      }
    }
    if (e.currentTarget.dataset.url != '' && e.currentTarget.dataset.url != undefined) {
      url = url + e.currentTarget.dataset.url
    }
    if (e.currentTarget.dataset.params != '' && e.currentTarget.dataset.params != undefined) {
      url = url + e.currentTarget.dataset.params.id
    }
    if (e.currentTarget.dataset.time != '' && e.currentTarget.dataset.time !=undefined){
      url = url + "?time=" + e.currentTarget.dataset.time
    }
    if (e.currentTarget.dataset.children != '' && e.currentTarget.dataset.children != undefined) {
      url = url + "?children=" + JSON.stringify(e.currentTarget.dataset.children)
    }
    // console.log(url)
    if (url == 'undefined?time=undefined' || url =="undefined"){
      
      return false
    }
    wx.navigateTo({
      url: url,
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
    wx.setStorageSync("token", '')
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
                if (that.data.formData["qrcode"]){
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
                      if (that.data.formData["qrcode"]) {
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
      wx.redirectTo({
        url: e.currentTarget.dataset.url,
      })
    }
  }
})
