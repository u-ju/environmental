 // pages/upload/index.js
 var util = require('../../utils/util.js');
 var util = require('../../utils/util.js');
 var apiurl = require('../../utils/api.js');
 var Promise = require('../../utils/es6-promise.js');
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
     skipphotoStatus: "0", // 1跳过 0没有跳过
     isShowImage: false,
     imagesarr: []
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function(options) {
     console.log(options.key)
     this.setData({
       windowWidth: wx.getSystemInfoSync().windowWidth,
       windowHeight: wx.getSystemInfoSync().windowHeight,
       width: wx.getSystemInfoSync().windowWidth,
       height: wx.getSystemInfoSync().windowHeight,
       key: options.key
     })

     this.ctx = wx.createCameraContext()
   },

   /**
    * 生命周期函数--监听页面初次渲染完成
    */
   onReady: function() {

   },

   /**
    * 生命周期函数--监听页面显示
    */
   onShow: function() {
     console.log(11111111)
     // var that = this
     // wx.authorize({
     //   scope: 'scope.camera',
     //   success: function (res) {
     //     console.log(res)
     //     that.setData({
     //       isShowCamera: true,
     //     })
     //   },
     //   fail: function (res) {
     //     console.log("" + res);
     //     wx.showModal({
     //       title: '请求授权您的摄像头',
     //       content: '如需正常使用此小程序功能，请您按确定并在设置页面授权用户信息',
     //       confirmText: '确定',
     //       success: res => {
     //         if (res.confirm) {
     //           wx.openSetting({
     //             success: function (res) {
     //               console.log('成功');
     //               console.log(res);
     //               if (res.authSetting['scope.camera']) { //设置允许获取摄像头
     //                 console.log('设置允许获取摄像头')
     //                 wx.showToast({
     //                   title: '授权成功',
     //                   icon: 'success',
     //                   duration: 1000
     //                 })
     //                 that.setData({
     //                   isShowCamera: true,
     //                 })

     //               } else { //不允许
     //                 wx.showToast({
     //                   title: '授权失败',
     //                   icon: 'none',
     //                   duration: 1000
     //                 })
     //                 // wx.redirectTo({
     //                 //   url: 'addCarInfo/addCarInfo',
     //                 // })
     //               }
     //             }
     //           })
     //         } else { //取消
     //           wx.showToast({
     //             title: '授权失败',
     //             icon: 'none',
     //             duration: 1000
     //           })
     //           // wx.redirectTo({
     //           //   url: 'addCarInfo/addCarInfo',
     //           // })
     //         }
     //       }
     //     })

     //   }
     // })
   },
   /**
    * 拍照
    */
   takePhotoAction: function() {
     var that = this
     that.ctx.takePhoto({
       quality: 'high', //高质量
       success: (res) => {
         that.loadTempImagePath(res.tempImagePath);
       },
     })
   },
   loadTempImagePath: function(options) {
     var that = this
     that.path = options
     wx.getSystemInfo({
       success: function(res) {
         that.setData({
           isShowImage: true,
         })
         // 矩形的位置
         var image_x = 16;
         var image_y = 100;
         var image_width = that.data.width - 2 * 16;
         var image_height = 216;
         console.log(that.data.width, that.data.height)

         wx.getImageInfo({
           src: that.path,
           success: function(res) {
             console.log(res)
             
             console.log(that.data.isShowImage)
             //  that.canvas = wx.createCanvasContext("imageCanvas", that)
             //  console.log(that.canvas)
             //  //过渡页面中，图片的路径坐标和大小
             //  that.canvas.drawImage(that.path, 0, 0, that.data.width, that.data.height)
             var context = wx.createCanvasContext('imageCanvas');
             console.log(context)
             context.drawImage(that.path, 0, 0, that.data.width, that.data.height)
             wx.showLoading({
               title: '数据处理中...',
               icon: 'loading',
               duration: 10000
             })
             // 这里有一些很神奇的操作,总结就是MD拍出来的照片规格居然不是统一的过渡页面中，对裁剪框的设定
             //  that.canvas.setStrokeStyle('black')
             //  that.canvas.strokeRect(image_x, image_y, image_width, image_height)
             context.setStrokeStyle('transparent')
             context.strokeRect(image_x, image_y, image_width, image_height)
             setTimeout(function() {
               context.draw(false, () => {
                 that.canvasTo('imageCanvas', context)
               })
             }, 500)

             
           }
         })
       }
     })
   },
   canvasTo(canvasId1, context) {
     console.log(canvasId1, context)
     var that = this
     var image_x = 16;
     var image_y = 100;
     var image_width = that.data.width - 2 * 16;
     var image_height = 216;
     console.log(image_width)
     wx.canvasToTempFilePath({ //裁剪对参数
       x: image_x, //画布x轴起点
       y: image_y, //画布y轴起点
       width: image_width, //画布宽度
       height: image_height, //画布高度
       destWidth: Number(image_width), //输出图片宽度
       destHeight: Number(image_height), //输出图片高度
       canvasId: canvasId1,
       success: function(res) {
         console.log(res)
         that.setData({
           image: res.tempFilePath,
           isShowCamera: false
         })
         //清除画布上在该矩形区域内的内容。
         // that.canvas.clearRect(0, 0, that.data.width, that.data.height)
         // that.canvas.drawImage(res.tempFilePath, image_x, image_y, image_width, image_height)
         // that.canvas.draw()
         wx.hideLoading()
         // var pic = wx.arrayBufferToBase64(res.tempFilePath)
         console.log(wx.arrayBufferToBase64(res.tempFilePath))
         var pic = res.tempFilePath
         wx.getFileSystemManager().readFile({
           filePath: pic, //选择图片返回的相对路径
           encoding: 'base64', //编码格式
           success: res => { //成功的回调 
             // resolve(res)
             console.log(res)
             var images = [{
               path_base: '',
               upload_percent: 0,
               path_server: '',
               path:''
             }]
             images[0]['path_base'] = 'data:image/png;base64,' + res.data
             images[0]['path'] = pic
             console.log(images)
             that.setData({
               images: images
             })
            //  that.setData({
            //    images: { pic: pic, path_base: 'data:image/png;base64,' + res.data}
            //  }) 
            
           },
           fail: function(error) {
             // reject(error);
             console.log(error)
           },
         })



         console.log(pic);
         //在此可进行网络请求
         //  PublicJS.drivinglicenseUpload(res.tempFilePath, that.uploadFile);
       },
       fail: function(e) {
         console.log(e)
         wx.hideLoading()
         wx.showToast({
           title: '出错啦...',
           icon: 'loading'
         })
       }

     })
   },
   // 接口返回结果

   uploadFile: function() {
     var that = this;
     var pic = this.data.images[0].path, path_base = this.data.images[0].path_base
     wx.uploadFile({
       // 模拟https
       url: apiurl.upload_image, //需要用HTTPS，同时在微信公众平台后台添加服务器地址  
       filePath: pic, //上传的文件本地地址    
       name: 'file',
       formData: {
         "image": path_base,
         'source': 'base64'
       },
       header: {
         "content-type": 'application/x-www-form-urlencoded',
         'token': util.getToken(),
         'channel': 'let',
         'build': apiurl.build
       },
       //附近数据，这里为路径     
       success: function (res) {
         console.log(res)
        //  var result = JSON.parse(res.data).result;
         var images = that.data.images
         images[0]['path_server'] = JSON.parse(res.data).result
         wx.setStorageSync(that.data.key, JSON.stringify(images))
         wx.navigateBack()
        //  console.log(result)
       },
       fail(e) {
         console.log(e)
       }
     })
    //  var that = this, images = this.data.images
    //  for (var j in images) {
    //    if (images[j]['upload_percent'] == 0) {
    //      //调用函数
    //      util.upload_pic(apiurl.upload_image, that, images, j, function (e) {
    //        console.log(e)
    //        that.setData({
    //          imagesarr: e,
    //        });
    //        util.hideLoading()
    //      }, function (e) {
    //        console.log(e)
    //        that.setData({
    //          imagesarr: e,
    //        });
    //      })
    //    }
    //  }
   },
   cancelPhotoAction() {
     this.setData({
       isShowImage: false,
       isShowCamera: true
     })
   },
   back() {
     wx.navigateBack()
   },
   /**
    * 生命周期函数--监听页面隐藏
    */
   onHide: function() {

   },

   /**
    * 生命周期函数--监听页面卸载
    */
   onUnload: function() {

   },

   /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
   onPullDownRefresh: function() {

   },

   /**
    * 页面上拉触底事件的处理函数
    */
   onReachBottom: function() {

   },

   /**
    * 用户点击右上角分享
    */
   onShareAppMessage: function() {

   }
 })
 // Page({
 //   onLoad() {
 //     this.ctx = wx.createCameraContext()
 //   },
 //   takePhoto() {
 //     this.ctx.takePhoto({
 //       quality: 'high',
 //       success: (res) => {
 //         this.setData({
 //           src: res.tempImagePath
 //         })
 //       }
 //     })
 //   },
 //   startRecord() {
 //     this.ctx.startRecord({
 //       success: (res) => {
 //         console.log('startRecord')
 //       }
 //     })
 //   },
 //   stopRecord() {
 //     this.ctx.stopRecord({
 //       success: (res) => {
 //         this.setData({
 //           src: res.tempThumbPath,
 //           videoSrc: res.tempVideoPath
 //         })
 //       }
 //     })
 //   },
 //   error(e) {
 //     console.log(e.detail)
 //   }
 // })