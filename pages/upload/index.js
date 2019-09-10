// pages/upload/index.js
Page({

  /**
   * 页面的初始数据
   */
  /**
   * 页面的初始数据
   */
  data: {
    isShowCamera: true,
    width: 10,
    height: 10,
    src: "",
    image: "",
    skipphotoStatus: "0",// 1跳过 0没有跳过
    isShowImage: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.ctx = wx.createCameraContext()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(11111111)
    var that = this
    wx.authorize({
      scope: 'scope.camera',
      success: function (res) {
        console.log(res)
        that.setData({
          isShowCamera: true,
        })
      },
      fail: function (res) {
        console.log("" + res);
        wx.showModal({
          title: '请求授权您的摄像头',
          content: '如需正常使用此小程序功能，请您按确定并在设置页面授权用户信息',
          confirmText: '确定',
          success: res => {
            if (res.confirm) {
              wx.openSetting({
                success: function (res) {
                  console.log('成功');
                  console.log(res);
                  if (res.authSetting['scope.camera']) { //设置允许获取摄像头
                    console.log('设置允许获取摄像头')
                    wx.showToast({
                      title: '授权成功',
                      icon: 'success',
                      duration: 1000
                    })
                    that.setData({
                      isShowCamera: true,
                    })

                  } else { //不允许
                    wx.showToast({
                      title: '授权失败',
                      icon: 'none',
                      duration: 1000
                    })
                    // wx.redirectTo({
                    //   url: 'addCarInfo/addCarInfo',
                    // })
                  }
                }
              })
            } else { //取消
              wx.showToast({
                title: '授权失败',
                icon: 'none',
                duration: 1000
              })
              // wx.redirectTo({
              //   url: 'addCarInfo/addCarInfo',
              // })
            }
          }
        })

      }
    })
  },
  /**
     * 拍照
     */
  takePhotoAction: function () {
    var that = this
    that.ctx.takePhoto({
      quality: 'high', //高质量
      success: (res) => {
        this.loadTempImagePath(res.tempImagePath);
      },
    })
  },
  loadTempImagePath: function (options) {
    var that = this
    that.path = options
    wx.getSystemInfo({
      success: function (res) {

        // 矩形的位置
        var image_x = 15;
        var image_y = 150;
        var image_width = that.data.width - 2 * 15;
        var image_height = 238;

        wx.getImageInfo({
          src: that.path,
          success: function (res) {
            that.setData({
              isShowImage: true,
            })
            that.canvas = wx.createCanvasContext("image-canvas", that)
            //过渡页面中，图片的路径坐标和大小
            that.canvas.drawImage(that.path, 0, 0, that.data.width, that.data.height)
            wx.showLoading({
              title: '数据处理中...',
              icon: 'loading',
              duration: 10000
            })
            // 这里有一些很神奇的操作,总结就是MD拍出来的照片规格居然不是统一的过渡页面中，对裁剪框的设定
            that.canvas.setStrokeStyle('black')
            that.canvas.strokeRect(image_x, image_y, image_width, image_height)
            that.canvas.draw()
            setTimeout(function () {
              wx.canvasToTempFilePath({ //裁剪对参数
                canvasId: "image-canvas",
                x: image_x, //画布x轴起点
                y: image_y, //画布y轴起点
                width: image_width, //画布宽度
                height: image_height, //画布高度
                destWidth: image_width, //输出图片宽度
                destHeight: image_height, //输出图片高度
                success: function (res) {
                  that.setData({
                    image: res.tempFilePath,
                  })
                  //清除画布上在该矩形区域内的内容。
                  // that.canvas.clearRect(0, 0, that.data.width, that.data.height)
                  // that.canvas.drawImage(res.tempFilePath, image_x, image_y, image_width, image_height)
                  // that.canvas.draw()
                  wx.hideLoading()

                  console.log(res.tempFilePath);
                  //在此可进行网络请求
                  PublicJS.drivinglicenseUpload(res.tempFilePath, that.uploadFile);
                },
                fail: function (e) {
                  wx.hideLoading()
                  wx.showToast({
                    title: '出错啦...',
                    icon: 'loading'
                  })
                  // if (this.data.skipphotoStatus == 1) {
                  //   wx.redirectTo({
                  //     url: 'addCarInfo/addCarInfo',
                  //   })
                  // } else {
                  //   wx.navigateBack({
                  //     delta: 1
                  //   });
                  // }
                }
              });
            }, 1000);
          }
        })
      }
    })
  },

  // 接口返回结果

  uploadFile: function (data) { },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})