// pages/busaddress/index.js

var QQMapWX = require('../../utils//qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({
  data: {
    latitude: 0,//地图初次加载时的纬度坐标
    longitude: 0, //地图初次加载时的经度坐标
    name: "" //选择的位置名称
  },
  onLoad: function () {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'MNXBZ-G5TWD-GYF42-HHZJL-2W2J3-PVBX4'
    });

    this.moveToLocation();
  },
  //移动选点
  moveToLocation: function () {
    console.log(111)
    var that = this;
    // 打开地图选择位置
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        // res.name为地址名称  
        console.log(res.name);
        //选择地点之后返回到原来页面
        // wx.navigateTo({
        //   url: "/pages/index/index?address=" + res.name
        // });
      },
      fail: function (err) {
        console.log(err)
      }
    });
  }
});