// pages/qrcode/qrcode.js
var qrCodeJS = require('../../utils/qrcode.js');
Page({
  data: {
    value: '',
    fgColor: 'black',
  },
  onLoad(options) {
    if (options.qrcode){

      this.setData({
        value: options.qrcode,
        avatar: '../../images/logozmn.jpg',
      })
      wx.hideLoading()
      qrCodeJS.qrApi.draw(this.data.value, "logoQRCode", 200, 200, null, this.data.avatar); 
    }
   },
  bindinput(e) {
    const value = e.detail.value
    const fgColor = this.randomColor()

    this.setData({
      value,
      fgColor,
    })
  },
  previewImage() {
    // 在自定义组件下，当前组件实例的 this，以操作组件内 <canvas> 组件
    const that = this
    wx.canvasToTempFilePath({
      canvasId: 'logoQRCode',
      success: (res1) => {
        // wx.previewImage({
        //   urls: [res.tempFilePath]
        // })
        wx.showModal({
          title: '保存图片',
          content: '确定要保存二维码？',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {
              wx.saveImageToPhotosAlbum({
                filePath: res1.tempFilePath,
                success(res) {
                  wx.showToast({
                    title: '保存成功',
                    icon: 'none',
                    duration: 2000,
                  });
                }
              })
            }
          }, fail: function (res) {
            console.log(11111)
          }
        })
      }
    }, that)
  },
  randomColor() {
    const colorStr = Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase()
    const length = colorStr.length
    const prefixStr = `000000`.substring(0, 6 - colorStr.length)
    return `#${prefixStr}${colorStr}`
  },
})