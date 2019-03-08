// pages/comment/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
var Promise = require('../../utils/es6-promise.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    upload_picture_list: [],
    // 建议内容
    opinion: "",
    title:'',
    content:'',
vicinage_id:''
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.vicinage_id){
      util.getJSON({ apiUrl: apiurl.vicinage_userShow + "?vicinage_id=" + options.vicinage_id}, function (res) {
        var upload_picture_list=[]
        for (var i in res.data.result.images) {

          upload_picture_list.push({ upload_percent: 100, 'path_server': res.data.result.images[i] })
        }
        that.setData({
          content: res.data.result.content,
          title: res.data.result.title,
          upload_picture_list: upload_picture_list,
          vicinage_id:options.vicinage_id
        })
        util.hideLoading()
      })
    }
  },
  /**
  * 评分
  */
  
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
  formSubmit(e){
    var that = this;
    var upload_picture_list = that.data.upload_picture_list, images = [], data = e.detail.value;
    for (var i = 0; i < upload_picture_list.length; i++) {
      // images[i] = upload_picture_list[i]['path_server'];
      data['images[' + i + ']'] = upload_picture_list[i]['path_server']
    }
    that.setData({
      disabled: true
    })
    var url = apiurl.vicinage_userStore
    if (that.data.vicinage_id != '' && that.data.vicinage_id !="undefined"){
      url = apiurl.vicinage_userUpdate
      data["vicinage_id"] = that.data.vicinage_id
    }
    util.postJSON({ apiUrl: url, data: data }, function (res) {
      var result = res.data.result
      util.hideLoading()
      wx.navigateTo({
        url: '../my_release/index',
      })
      that.setData({
        disabled: false
      })
    }, function () {
      that.setData({
        disabled: false
      })
    }, function () {
      that.setData({
        disabled: false
      })
    })
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

  },

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