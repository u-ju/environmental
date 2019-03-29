// pages/realname_authentication/realname_authentication.js
var util = require('../../utils/util.js');
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
var Promise = require('../../utils/es6-promise.js');
// var model = require('../../Components/model/model.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: '',
    upload_picture_list: [],
    upload_picture_list1: [],
    upload_picture_list2: [],
    showModalStatus:false,
    sure:false
  },
  //选择图片方法
  uploadpic: function (e) {
    // console.log(e)
    var that = this //获取上下文
    var upload_picture = []
    //选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFiles = res.tempFiles, promiseArr=[]
        //把选择的图片 添加到集合里
        for (var i in tempFiles) {
          let promise = new Promise((resolve, reject) => {
            wx.getFileSystemManager().readFile({
              filePath: tempFiles[i]['path'], //选择图片返回的相对路径
              encoding: 'base64', //编码格式
              success: res => { //成功的回调 
                resolve(res)
              },
              fail: function (error) {
                reject(error);
              },
            })
          })
          promiseArr.push(promise)
        }
        
        Promise.all(promiseArr).then((res) => {
          // console.log(res)
          for (var i in res) {
            tempFiles[i]['path_base'] = 'data:image/png;base64,' + res[i].data
            tempFiles[i]['upload_percent'] = 0
            tempFiles[i]['path_server'] = ''
            upload_picture.push(tempFiles[i])
          }
          
          if (e.currentTarget.dataset.image == "image") {
            // console.log(1)
            that.setData({
              upload_picture_list: upload_picture,
            });
            that.uploadimage(upload_picture, 'upload_picture_list')
          } else if (e.currentTarget.dataset.image == "image1") {
            console.log(2)
            that.setData({
              upload_picture_list1: upload_picture,
            });
            that.uploadimage(upload_picture, 'upload_picture_list1')
          } else {
            console.log(3)
            that.setData({
              upload_picture_list2: upload_picture,
            });
            that.uploadimage(upload_picture, 'upload_picture_list2')
          }
        })
      }
    })
  },
  //点击上传事件
  uploadimage: function (upload_picture,arr) {
    console.log(1)
    var page = this
    //循环把图片上传到服务器 并显示进度       
    for (var j in upload_picture) {
      if (upload_picture[j]['upload_percent'] == 0) {
        　　　　　　//调用函数
        util.upload_file_server(apiurl.upload_image, page, upload_picture, j,arr)
      }
    }
  },
  // upload_file_server(url, that, upload_picture_list, j, arr, storge) {
  //   //上传返回值
  //   var _this = this;
  //   console.log(upload_picture_list[j])
  // const upload_task = wx.uploadFile({
  //     // 模拟https
  //     url: url, //需要用HTTPS，同时在微信公众平台后台添加服务器地址  
  //     filePath: upload_picture_list[j]['path'], //上传的文件本地地址    
  //     name: 'file',
  //     formData: {
  //       "image": upload_picture_list[j]['path_base'],
  //       'source': 'base64'
  //     },
  //     header: {
  //       "content-type": 'application/x-www-form-urlencoded',
  //       'token': util.getToken(),
  //       'channel': 'let',
  //       'build': 9999999
  //     },
  //     //附近数据，这里为路径     
  //     success: function (res) {
  //       console.log(res)
  //       var data = JSON.parse(res.data);
  //       // //字符串转化为JSON  

  //       if (data.status == 200) {
  //         var filename = data.result.image_url //存储地址 显示
  //         upload_picture_list[j]['path_server'] = filename

  //       } else {
  //         upload_picture_list[j]['path_server'] = filename
  //       }

  //       if (arr == 'upload_picture_list1') {
  //         that.setData({
  //           upload_picture_list1: upload_picture_list
  //         });
  //       } else if (arr == 'upload_picture_list2') {
  //         that.setData({
  //           upload_picture_list2: upload_picture_list
  //         });
  //       } else {
  //         if (storge == 1) {
  //           wx.setStorageSync('upload_picture_list', upload_picture_list)
  //         }
  //         that.setData({
  //           upload_picture_list: upload_picture_list
  //         });
  //       }

  //       wx.setStorageSync('imgs', upload_picture_list);
  //     }
  //   })
  // // 上传 进度方法

  // upload_task.onProgressUpdate((res) => {
  //     upload_picture_list[j]['upload_percent'] = res.progress
  //     if (arr == 'upload_picture_list1') {
  //       that.setData({
  //         upload_picture_list1: upload_picture_list
  //       });
  //     } else if (arr == 'upload_picture_list2') {
  //       that.setData({
  //         upload_picture_list2: upload_picture_list
  //       });
  //     } else {
  //       that.setData({
  //         upload_picture_list: upload_picture_list
  //       });
  //     }


  //   });
  // },
  // 删除图片
  deleteImg: function (e) {
    // let upload_picture_list = this.data.upload_picture_list;
    // let index = e.currentTarget.dataset.index;
    // upload_picture_list.splice(index, 1);
    // this.setData({
    //   upload_picture_list: upload_picture_list
    // });
    var that= this;
    if (e.currentTarget.dataset.image == "image") {
      that.setData({
        upload_picture_list: [],
      });
    } else if(e.currentTarget.dataset.image == "image1") {
      that.setData({
        upload_picture_list1: [],
      });
    } else {
      that.setData({
        upload_picture_list2: [],
      });
    }
  },
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  formSubmit(e){
    // var arr = ['upload_picture_list', 'upload_picture_list1', 'upload_picture_list2'];
    // var tishi = ["请上传人像面", "请上传国徽面", "请上传头像",];
    var that =this
    // for(var i in arr){
    //   console.log(that.data[arr[i]])
    //   if (that.data[arr[i]].length>0 && that.data[arr[i]][0].path_server){
    //     console.log(1)
    //     a=a+1;
    //   }else{
    //     util.alert(tishi[i])
    //     return false
    //   }
    // }
    // if(a==3){
    var data = e.detail.value
      data.step= 2, 
      data.front= that.data.upload_picture_list[0].path_server||''
      data.back = that.data.upload_picture_list1[0].path_server || ''
      data.avatar = that.data.upload_picture_list2[0].path_server || ''
      console.log(data)
      that.setData({
        sure:true
      })
      util.postJSON({ apiUrl: apiurl.realname_verify, data: data}, function (res) {
          util.alert(res.data.message)
          wx.navigateBack({
            delta: 2,
            success(){
              that.setData({
                sure: false
              })
            }
          })
          
           
      },function(){
        that.setData({
          sure: false
        })
        }, function () {
          that.setData({
            sure: false
          })
        })
    // }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.hideLoading()
  },

})