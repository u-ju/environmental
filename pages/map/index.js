var bmap = require('../../utils/bmap-wx.min.js'); 
var wxMarkerData = [];
var util = require('../../utils/util.js');
var BMap = new bmap.BMapWX({
  ak: util.bmak
});
var QQMapWX = require('../../utils//qqmap-wx-jssdk.min.js');

// 实例化API核心类
let demo  = new QQMapWX({
  key: 'HPNBZ-B426V-CZQPP-UN4R6-QYOF2-MYFU3' // 必填
});
Page({
  data: {
    markers: [],
    latitude: '',
    longitude: '',
    rgcData: {}
  },
  makertap: function (e) {
    var that = this;
    var id = e.markerId;
    that.showSearchInfo(wxMarkerData, id);
  },
  onLoad: function () {
    var that = this;
    // 新建百度地图对象 
    
    this.setData({
      adrr: '成都火车北站'
    })
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      wxMarkerData = data.wxMarkerData;
      that.setData({
        markers: wxMarkerData
      });
      that.setData({
        latitude: wxMarkerData[0].latitude
      });
      that.setData({
        longitude: wxMarkerData[0].longitude
      });
    }
    // 发起regeocoding检索请求 
    BMap.regeocoding({
      fail: fail,
      width:22,
      height:27,
      success: success,
      iconPath: '../../images/icon_location@2x.png',
      iconTapPath: '../../images/icon_location@2x.png'
    });
  },
  showSearchInfo: function (data, i) {
    var that = this;
    that.setData({
      rgcData: {
        address: '地址：' + data[i].address + '\n',
        desc: '描述：' + data[i].desc + '\n',
        business: '商圈：' + data[i].business
      }
    });
  },
  seeMap(){
    demo.geocoder({
      address: this.data.adrr,
      success: res => {
        wx.openLocation({
          latitude: res.result.location.lat,
          longitude: res.result.location.lng,
          scale: 28
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  }

})