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
  // 查看图片
  previewImg(e) {
    util.previewImage(e.currentTarget.dataset.src)
  },
  //选择图片方法
  uploadpic: function (e) {

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

          for (var i in res) {
            tempFiles[i]['path_base'] = 'data:image/png;base64,' + res[i].data
            tempFiles[i]['upload_percent'] = 0
            tempFiles[i]['path_server'] = ''
            upload_picture.push(tempFiles[i])
          }
          
          if (e.currentTarget.dataset.image == "image") {

            that.setData({
              upload_picture_list: upload_picture,
            });
            that.uploadimage(upload_picture, 'upload_picture_list')
          } else if (e.currentTarget.dataset.image == "image1") {

            that.setData({
              upload_picture_list1: upload_picture,
            });
            that.uploadimage(upload_picture, 'upload_picture_list1')
          } else {

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

    var page = this
    //循环把图片上传到服务器 并显示进度       
    for (var j in upload_picture) {
      if (upload_picture[j]['upload_percent'] == 0) {
        　　　　　　//调用函数
        util.upload_file_server(apiurl.upload_image, page, upload_picture, j,arr,'',function(img){
          console.log(arr,img)
          wx.setStorageSync(arr+'s', img)
        })
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

      that.setData({
        sure:true
      })
      console.log(data)
      // util.postJSON({ apiUrl: apiurl.realname_verify, data: data}, function (res) {
      //     util.alert(res.data.message)
      //     util.navigateBack(2)  
      // },function(){
      //   that.setData({
      //     sure: false
      //   })
      //   }, function () {
      //     that.setData({
      //       sure: false
      //     })
      //   })
    // }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  input(e) {
    console.log(e)
    wx.setStorageSync(e.currentTarget.dataset.name + "s", e.detail.value)
  },
  onLoad: function (options) {
    // console.log(wx.getStorageSync("upload_picture_lists"))
    var arr = ['realname', 'idcard', 'nation', "address", 'upload_picture_list', 'upload_picture_list1','upload_picture_list2']
    for(var i in arr){
      this.setData({
        [arr[i]]: wx.getStorageSync(arr[i] + 's') 
      })
    }
    wx.hideLoading()
  },
  onUnload(){
    var that = this;
    // return util.popoutc('是否保存实名认证中已填写的内容', '不保存', '#444444', '保存', '#4FD6F0', function () {
    //   console.log("取消")
    // }, function () {
    //   console.log("确定")
    // })
  }
})