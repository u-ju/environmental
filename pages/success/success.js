const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
var link = require('../../utils/link.js');
var template = require('../../Components/tab-bar/tab-bar.js');
var bmap = require('../../utils/bmap-wx.min.js');
Page({
    data: {
      images: ["https://wyhb-res-pr.zgwyhb.com/uploads/image/2019/05/31/daeb85f1ed35595ccf81092f7848e0bc.jpg?x-oss-process=image/resize,w_1920/quality,Q_80",
        "https://wyhb-res-pr.zgwyhb.com/uploads/image/2019/05/31/ef5f74c39f0e4adaf814bae1c40582ab.jpg?x-oss-process=image/resize,w_1920/quality,Q_80",
        "https://wyhb-res-pr.zgwyhb.com/uploads/image/2019/05/31/46b3e906cadcc8b6db35786cd75693aa.jpg?x-oss-process=image/resize,w_1920/quality,Q_80",
        "https://wyhb-res-pr.zgwyhb.com/uploads/image/2019/05/31/1fb5bdefab7d4b28d05345ad137ce71c.jpg?x-oss-process=image/resize,w_1920/quality,Q_80",
        "https://wyhb-res-pr.zgwyhb.com/uploads/image/2019/05/31/daeb85f1ed35595ccf81092f7848e0bc.jpg?x-oss-process=image/resize,w_1920/quality,Q_80",
        "https://wyhb-res-pr.zgwyhb.com/uploads/image/2019/05/31/338e04a651438cd423ff7961b3dfefa9.jpg?x-oss-process=image/resize,w_1920/quality,Q_80",
        "https://wyhb-res-pr.zgwyhb.com/uploads/image/2019/05/31/787d2747a6f04682e75f96e49e8cb540.jpg?x-oss-process=image/resize,w_1920/quality,Q_80"],
      indicatorDots: true, //显示面板指示点
      autoplay: false, //自动播放
      beforeColor: "#DCDCDC", //指示点颜色
      afterColor: "#27AAD9", //当前选中的指示点颜色
      interval: 5000,
      duration: 1000,
    },
    onLoad(e){
      
    },
  // 查看图片
  previewImg(e) {
    util.previewImage(e.currentTarget.dataset.src, this.data.images)
  },
})