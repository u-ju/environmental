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
  
  // 删除图片
  deleteImg: function (e) {
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
    var data = e.detail.value, that = this;
      data.step= 2
    data.front = that.data.upload_picture_list[0] && that.data.upload_picture_list[0].path_server ? that.data.upload_picture_list[0].path_server:''
    data.back = that.data.upload_picture_list1[0] && that.data.upload_picture_list1[0].path_server ? that.data.upload_picture_list1[0].path_server: '' 
    data.avatar = that.data.upload_picture_list2[0] && that.data.upload_picture_list2[0].path_server ? that.data.upload_picture_list2[0].path_server:''  
      console.log(data)
      that.setData({
        sure:true
      })
      util.postJSON({ apiUrl: apiurl.realname_verify, data: data}, function (res) {
          util.alert(res.data.message)
          util.navigateBack(2)  
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