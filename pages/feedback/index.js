// pages/feedback/index.js
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
    opinion: "",
    currentWordNumber:0,
    disabled: false,
    max:1000,
    content:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideLoading()
  },
  //字数限制  
  inputs: function (e) {
    // 获取输入框的内容
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);
    //最多字数限制
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      currentWordNumber: len //当前字数  
    });
  },
  
  uploadpic(e) {
    var that = this;
    var index = e.currentTarget.dataset.indexnum;
    util.uploadpic(that, 9, 'upload_picture_list', '', function (images) {
      
      that.setData({
        upload_picture_list: images,
      });
      for (var j in images) {
        if (images[j]['upload_percent'] == 0) {
          //调用函数
          util.upload_pic(apiurl.upload_image, that, images, j, function (e) {
            that.setData({
              upload_picture_list: e,
            });
            util.hideLoading()
          
          }, function (e) {
            that.setData({
              upload_picture_list: e,
            });
          })
        }
      }
    })
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
  formSubmit(e) {
    
    var that = this, data = e.detail.value;
    var upload_picture_list = that.data.upload_picture_list;
    for (var i = 0; i < upload_picture_list.length; i++) {
      data['images[' + i + ']'] = upload_picture_list[i]['path_server']
    }
    that.setData({
      disabled: true
    })
    util.postJSON({ apiUrl: apiurl.feedback, data: data }, function (res) {
      var result = res.data.result
      util.hideLoading()
      wx.navigateBack()
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

  
})