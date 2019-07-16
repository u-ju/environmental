// pages/tailor/tailor.js
import WeCropper from '../we-cropper/we-cropper.js'

const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 50
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({
  data: {
    cropperOpt: {
      id: 'cropper',
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: (width - 300) / 2,
        y: (height - 300) / 2,
        width: 300,
        height: 300
      }
    },
    click: true
  },
  touchStart(e) {
    this.wecropper.touchStart(e)
  },
  touchMove(e) {
    this.wecropper.touchMove(e)
  },
  touchEnd(e) {
    this.wecropper.touchEnd(e)
  },
  getCropperImage() {
    var that = this;
    wx.showLoading()
    this.wecropper.getCropperImage((avatar) => {
      if (avatar && that.data.click) {
        console.log(avatar)
        //  获取到裁剪后的图片
        // let base64 = wx.arrayBufferToBase64(avatar);
        // var avatar1 = 'data:image/jpg;base64,' + base64;
        wx.getFileSystemManager().readFile({
          filePath: avatar, //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调 
            console.log(res)
            var avatar1 = res.data
            wx.uploadFile({
              url: apiurl.user_update, // 后台 java 上传接口
              filePath: avatar,
              name: 'file',
              formData: {
                "avatar": avatar1,
                'source': 'base64'
              },
              header: {
                "content-type": 'application/x-www-form-urlencoded',
                'token': util.getToken(),
                'channel': 'let',
                'build': apiurl.build
              },
              success(res) {

                var data = JSON.parse(res.data);
                console.log(data)
                wx.navigateBack()
              },
              fail: function(errMsg) {
                console.log(errMsg);
              }
            });
          },
          fail: function(error) {},
        })

      } else {
        console.log('获取图片失败，请稍后重试')
      }
    })
  },
  getimg(avatar1) {
    util.postJSON({
      apiUrl: apiurl.user_update,
      data: {
        avatar: avatar1
      }
    }, function(res) {
      var result = res.data.result
      util.info_dialog(res.data.message)
      wx.navigateBack()
      // util.hideLoading()
    })
  },
  uploadTap() {
    const self = this

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0]
        //  获取裁剪图片资源后，给data添加src属性及其值

        self.wecropper.pushOrign(src)
      }
    })
  },
  onLoad(option) {
    this.setData({
      src: option.data
    })
    const {
      cropperOpt
    } = this.data
    if (option.src) {
      console.log(option.data)
      cropperOpt.src = option.src
      cropperOpt.src1 = option.data
      new WeCropper(cropperOpt)
        .on('ready', (ctx) => {
          console.log(`wecropper is ready for work!`)
        })
        .on('beforeImageLoad', (ctx) => {
          console.log(`before picture loaded, i can do something`)
          console.log(`current canvas context:`, ctx)
          wx.showToast({
            title: '上传中',
            icon: 'loading',
            duration: 20000
          })
        })
        .on('imageLoad', (ctx) => {
          console.log(`picture loaded`)
          console.log(`current canvas context:`, ctx)
          wx.hideToast()
        })
        .on('beforeDraw', (ctx, instance) => {
          console.log(`before canvas draw,i can do something`)
          console.log(`current canvas context:`, ctx)
        })
        .updateCanvas()
    }
  }
})