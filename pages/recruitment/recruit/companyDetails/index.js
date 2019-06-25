// pages/recruitment/recruit/companyDetails/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image: [
      { title: 'logo图片', upload_picture_list: [], text: "点击拍摄/上传图片", id: 0 },
      { title: '营业执照', upload_picture_list: [], text: "点击拍摄/上传图片", id: 1 },
    ],
  },
  num(e){
    console.log(e.detail.value)
    var that=this
    this.numlis(e.detail.value,40,function(){
      that.setData({
        name: e.detail.value
      })
    })
  },
  intronum(e){
    var that = this
    this.numlis(e.detail.value, 1000, function () {
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