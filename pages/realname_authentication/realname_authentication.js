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
    upload_picture_list0: [],
    upload_picture_list1: [],
    upload_picture_list2: [],
    showModalStatus:false,
    sure:false
  },
  // 查看图片
  previewImg(e) {
    util.previewImage(e.currentTarget.dataset.src)
  },
  // 上传图片
 
  uploadpic(e) {
    var that = this;
    var list = 'upload_picture_list' + e.currentTarget.dataset.num;
    if (e.currentTarget.dataset.num<2){
      return wx.navigateTo({
        url: '../upload/index?key=idcard' + e.currentTarget.dataset.num,
      })
    }
    util.uploadpic(that, 1, list, '', function (images) {
      console.log(images)
      that.setData({
        [list]: images,
      });
      for (var j in images) {
        if (images[j]['upload_percent'] == 0) {
          //调用函数
          util.upload_pic(apiurl.upload_image, that, images, j, function (e) {
            console.log(images)
            that.setData({
              [list]: e,
            });
            util.hideLoading()
          }, function (e) {
            that.setData({
              [list]: e,
            });
          })
        }
      }
    })
  },
  // 删除图片
  deleteImg: function (e) {
    var that= this;
    var list = 'upload_picture_list' + e.currentTarget.dataset.num;
    that.setData({
      [list]: [],
    });
  },
  
  formSubmit(e){
    var data = {}, that = this;
      // data.step= 2
    data.front = that.data.upload_picture_list0[0] && that.data.upload_picture_list0[0].path_server ? that.data.upload_picture_list0[0].path_server:''
    data.back = that.data.upload_picture_list1[0] && that.data.upload_picture_list1[0].path_server ? that.data.upload_picture_list1[0].path_server: '' 
    data.avatar = that.data.upload_picture_list2[0] && that.data.upload_picture_list2[0].path_server ? that.data.upload_picture_list2[0].path_server:''  

      that.setData({
        sure:true
      })
      console.log(data)
      util.postJSON({ apiUrl: apiurl.realname_verify, data: data}, function (res) {
        
        util.alert(res.data.message)
        util.navigateBack(2)  
        that.setData({
          sure: false
        })
          // 
      },function(){
        that.setData({
          sure: false
        })
        }, function () {
          that.setData({
            sure: false
          })
        })
  },
  
  onLoad: function (options) {
    
  },
  onShow(){
    var that = this;
    console.log(wx.getStorageSync('idcard0'))
    this.setData({
      upload_picture_list0: (wx.getStorageSync('idcard0') && JSON.parse(wx.getStorageSync('idcard0'))) || [],
      upload_picture_list1: (wx.getStorageSync('idcard1') && JSON.parse(wx.getStorageSync('idcard1'))) || [],
    })
  },
  onUnload(){
    var that = this;
  }
})