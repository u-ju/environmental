// pages/recruitment/recruit/cardCreate/index.js
const app = getApp()
var util = require('../../../utils/util.js');
var apiurl = require('../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    upload_picture_list: [],
    result: [],
    post: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.init()
  },
  init(page = 1) {
    var that = this;
    util.getJSON({
      apiUrl: apiurl.recruit.personHome,
    }, function(res) {
      var result = res.data.result,
        upload_picture_list = '',
        contact = '',
        duty = '',
        email = '',
        name = ''
      // var upload_picture_list = [{ upload_percent: 100, path_server: result.recruit_person.avatar }]
      if (result.is_recruit_person == 0) {
        upload_picture_list = [{ upload_percent: 100, path_server: result.suggest.avatar }]
        contact = result.suggest.contact || ''
        duty = result.suggest.duty||''
        email = result.suggest.email || ''
        name = result.suggest.name || ''
      } else {
        upload_picture_list = [{ upload_percent: 100, path_server: result.recruit_person.avatar }]
        contact = result.recruit_person.contact || ''
        duty = result.recruit_person.duty || ''
        email = result.recruit_person.email || ''
        name = result.recruit_person.name || ''
      }
      that.setData({
        result: result,
        upload_picture_list: upload_picture_list,
        contact: contact,
        duty: duty,
        email: email,
        name: name,
        is_recruit_person: result.is_recruit_person,
        is_recruit_company: result.is_recruit_company
      })
      wx.hideLoading()
    })
  },
  uploadpic() {
    var that = this;
    util.uploadpic(that, 1, 'upload_picture_list', '', function(images) {
      console.log(images)
      that.setData({
        upload_picture_list: images,
      });
      for (var j in images) {
        if (images[j]['upload_percent'] == 0) {
          //调用函数
          util.upload_pic(apiurl.upload_image, that, images, j, function(e) {
            that.setData({
              upload_picture_list: e,
            });
            util.hideLoading()
          }, function(e) {
            that.setData({
              upload_picture_list: e,
            });
          })
        }
      }
    })
  },
  submit(e) {
    console.log(e)
    var data = e.detail.value,
      url = '',
      that = this
    data.avatar = this.data.upload_picture_list[0].path_server
    // console.log(data)
    url = "personUpdate"
    if (this.data.is_recruit_person == 0) {
      url = "personStore"
    }
    this.setData({
      post: true
    })
    util.postJSON({
      apiUrl: apiurl.recruit[url],
      data: data
    }, function(res) {
      that.setData({
        post: false
      })
      that.init()
      wx.hideLoading()
    }, function(res) {
      that.setData({
        post: false
      })
      wx.hideLoading()
    }, function(res) {
      that.setData({
        post: false
      })
      wx.hideLoading()
    })
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