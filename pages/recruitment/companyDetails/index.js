// pages/recruitment/recruit/companyDetails/index.js
const app = getApp()
var util = require('../../../utils/util.js');
var apiurl = require('../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image: [
      { title: 'logo图片', upload_picture_list: [], text: "点击拍摄/上传图片", id: 0 },
      { title: '营业执照', upload_picture_list: [], text: "点击拍摄/上传图片", id: 1 },
    ],
    url: "companyStore"
  },
  init() {
    var that = this;
    util.getJSON({
      apiUrl: apiurl.recruit.companyShow,
    }, function (res) {
      var result = res.data.result
      var image=[
        { title: 'logo图片', upload_picture_list: [{ upload_percent: 100, path_server: result.thumb || "" }], text: "点击拍摄/上传图片", id: 0 },
        { title: '营业执照', upload_picture_list: [{ upload_percent: 100, path_server: result.license || "" }], text: "点击拍摄/上传图片", id: 1 },
      ]
      that.setData({
        image: image,
        person_id: result.person_id || "",
        name: result.name || "",
        intro: result.intro || "",
        status_name: result.status_name || "",
        status_remark: result.status_remark || "",
      })
      wx.hideLoading()
    })
  },
  num(e){
    console.log(e.detail.value)
    var that=this
    this.numlis(e.detail.value,64,function(){
      that.setData({
        name: e.detail.value
      })
    })
  },
  intronum(e){
    var that = this
    this.numlis(e.detail.value, 2000, function () {
      that.setData({
        name: e.detail.value
      })
    })
  },
  numlis(value, num,suc){
    if (value.length>num){
      return 
    }
    suc()
  },
  uploadpic1(e) {
    var that = this;
    var index = e.currentTarget.dataset.indexnum;

    util.uploadpic(that, 1, 'upload_picture_list', e.currentTarget.dataset.indexnum, function (images) {
      console.log(images)
      that.setData({
        ['upload_picture_list[' + index+']']: images,
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
    if (getApp().globalData.is_==1){
      
      this.setData({
        url: "companyUpdate"
      })
    }
    
  },
  submit(e) {
    console.log(e)
    var data = e.detail.value,that = this
    data.thumb = this.data.image[0].upload_picture_list[0].path_server
    data.license = this.data.image[1].upload_picture_list[0].path_server
    this.setData({
      post: true
    })
    // console.log(data)
    util.postJSON({
      apiUrl: apiurl.recruit[that.data.url],
      data: data
    }, function (res) {
      that.setData({
        post: false
      })
      wx.hideLoading()
    }, function (res) {
      that.setData({
        post: false
      })
      wx.hideLoading()
    }, function (res) {
      that.setData({
        post: false
      })
      wx.hideLoading()
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