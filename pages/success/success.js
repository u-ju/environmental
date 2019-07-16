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
      previewImg: [
        "https://wyhb-res-pr.zgwyhb.com/uploads/image/2019/03/04/52af99144219537f465a023c1a468ff4.jpg?x-oss-process=image/resize,w_1920", "https://wyhb-res-pr.zgwyhb.com/uploads/image/2019/03/04/7113486cf12cda95e605d7382a108eb5.jpg?x-oss-process=image/resize,w_1920", "https://wyhb-res-pr.zgwyhb.com/uploads/image/2019/03/04/9bb64ca1360373f1edc2201b5f4e8bb4.jpg?x-oss-process=image/resize,w_1920", "https://wyhb-res-pr.zgwyhb.com/uploads/image/2019/03/04/268470b52d0b097b8a73ed68f084fb92.jpg?x-oss-process=image/resize,w_1920"
      ]
    },
    onLoad(e){
      
    },
  // 查看图片
  previewImg(e) {
    util.previewImage(e.currentTarget.dataset.src, this.data.images)
  },
  previewImageFn: function () {
    if (this.data.previewImg.length > 0) {
      wx.previewImage({
        current: this.data.previewImg[0], // 当前显示图片的http链接
        urls: this.data.previewImg, // 需要预览的图片http链接列表
        success(e){
          console.log('成功')
          console.log(e)
        },
        fail(e){
          console.log('失败')
          console.log(e)
        },
        complete(e){
          console.log(e)
        }
      })
    }
  },  
})