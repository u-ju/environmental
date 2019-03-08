// pages/delivery_station/delivery_station.js
let hospitalData = [{
  id: 1,
  longitude: 104.20194,
  latitude: 30.65984,
  name: "成都市呼呼楼",
  image:"../../images/box-b@2x.png",
  callout: {
    content: "成都市呼呼楼",
    padding: 10,
    display: 'ALWAYS',
    textAlign: 'center'
  }
}
]
var QQMapWX = require('../../utils//qqmap-wx-jssdk.min.js');
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({
  data: {
    longitude: 0.0,
    latitude: 0.0,
    //可能我标识的地点和你所在区域比较远，缩放比例建议5;
    scale: 15,
    list:[],
    markers: [],
    controls: [{
      id: 1,
      iconPath: '../../images/location-control.png',
      position: {
        left: 0,
        top: 10,
        width: 40,
        height: 40
      },
      clickable: true
    }]
  },
  onReady: function (e) {
    // 使用 wx.createMapContext 获取 map 上下文 
    this.mapCtx = wx.createMapContext('myMap')
  },

  onLoad: function (options) {
    util.loading()
    let that = this
    if(options.data){
      var data = JSON.parse(options.data)
        console.log(data)
        that.setData({
          latitude: Number(data.latitude),
          longitude: Number(data.longitude),
        })
      wx.openLocation({
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
        scale: 15,
        name: data.area_name,
        address: data.address,
      })
      }
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: (res) => {
        let latitude = res.latitude;
        let longitude = res.longitude;
        let marker = this.createMarker(res);
        this.setData({
          longitude: longitude,
          latitude: latitude,
          markers: this.getHospitalMarkers()
        })
        app.globalData.longitude = longitude
        app.globalData.latitude = latitude
      }
    });
    
    
    
    // var qqmapsdk = new QQMapWX({
    //   key: 'HPNBZ-B426V-CZQPP-UN4R6-QYOF2-MYFU3'//此处使用你自己申请的key
    // });
    // wx.getLocation({
    //   type: 'gcj02', //返回可以用于wx.openLocation的经纬度
    //   success: function (res) {
    //     console.log(res)
    //     var latitude = res.latitude;
    //     var longitude = res.longitude;
    //     let marker = that.createMarker(res);
    //     that.setData({
    //       longitude: longitude,
    //       latitude: latitude,
    //       markers: that.getHospitalMarkers()
    //     })
        // qqmapsdk.reverseGeocoder({
        //   location: {
        //     latitude: res.latitude,
        //     longitude: res.longitude
        //   },
        //   success: function (addressRes) {
        //     var address = addressRes.result.formatted_addresses.recommend;
        //       console.log(address)
        //     wx.openLocation({
        //       latitude: latitude,
        //       longitude: longitude,
        //       scale: 15,
        //       address: address
        //     })

        //   }
        // })

      // }
    // });
  },
  nav(){
    wx.openLocation({
      latitude: Number(this.data.latitude),
      longitude: Number(this.data.longitude),
      scale: 15,
      name: data.area_name,
      address: data.address,
    })
  },
  /**
   * 标示点移动触发
   */
  regionchange(e) {
    // console.log(e.type)
  },

  /**
   * 点击标识点触发
   */
  markertap(e) {
    console.log(e)
    for (var key in this.data.list){
      console.log(hospitalData[key])
      if (hospitalData[key].garbage_ark_id==e.markerId){
        wx.openLocation({
          latitude: hospitalData[key].latitude,
          longitude: hospitalData[key].longitude,
          name: hospitalData[key].name,
          address:"垃圾桶"
        })
      }
    }
  },

  /**
   * control控件点击时间
   */
  controltap(e) {
    console.log(e.controlId)
    this.moveToLocation()
  },


  /**
   * 获取医院标识
   */
  getHospitalMarkers() {
    let markers = [],that = this;
    util.getJSON({ apiUrl: apiurl.arkIndex, data: { token: util.getToken() } }, function (res) {
      var result = res.data.result;
      that.setData({
        list: result.list
      })
      for (let item of result.list) {
        let marker = that.createMarker(item);
        markers.push(marker)
      }
      util.hideLoading()
    })
    
    return markers;
  },

  /**
   * 移动到自己位置
   */
  moveToLocation: function () {
    let mpCtx = wx.createMapContext("map");
    mpCtx.moveToLocation();
  },


  /**
   * 还有地图标识，可以在name上面动手
   */
  createMarker(point) {
    let latitude = point.latitude;
    let longitude = point.longitude;
    let marker = {
      iconPath: point.thumb ||"../../images/box-b@2x.png",
      id: point.garbage_ark_id || 0,
      name: point.area_name || '',
      latitude: latitude,
      longitude: longitude,
      width: 24,
      height: 30
    };
    return marker;
  },
  list(){
    console.log("list")
    wx.navigateTo({
      url: '../delivery_station_list/delivery_station_list',
    })
  }
})

