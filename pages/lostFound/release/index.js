// pages/lostFound/release/index.js
const app = getApp()
var util = require('../../../utils/util.js');
var apiurl = require('../../../utils/api.js');
var Promise = require('../../../utils/es6-promise.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:false,
    intro:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  show() {
    this.setData({
      show: true
    })
  },
  unshow() {
    this.setData({
      show: false
    })
  },
  input(e){
    this.setData({
      intro:e.detail.value
    })
  },
  getJm(tempFiles) {
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

  },
  //选择图片方法
  uploadpic: function (e) {
    var that = this //获取上下文
    var upload_picture_list = that.data.upload_picture_list
    //选择图片
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFiles = res.tempFiles
        var promiseArr = []
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
          //对返回的result数组进行处理
          for (var i in res) {
            tempFiles[i]['path_base'] = 'data:image/png;base64,' + res[i].data
            tempFiles[i]['upload_percent'] = 0
            tempFiles[i]['path_server'] = ''
            upload_picture_list.push(tempFiles[i])
          }
          that.setData({
            upload_picture_list: upload_picture_list,
          });
          that.uploadimage()
        })
      }
    })
  },
  //点击上传事件
  uploadimage: function () {
    var page = this
    var upload_picture_list = page.data.upload_picture_list
    //循环把图片上传到服务器 并显示进度       
    for (var j in upload_picture_list) {
      if (upload_picture_list[j]['upload_percent'] == 0) {
        //调用函数
        util.upload_file_server(apiurl.upload_image, page, upload_picture_list, j)
      }
    }
  },

  // 删除图片
  deleteImg: function (e) {
    let upload_picture_list = this.data.upload_picture_list;
    let index = e.currentTarget.dataset.index;
    upload_picture_list.splice(index, 1);
    this.setData({
      upload_picture_list: upload_picture_list
    });
  },
})