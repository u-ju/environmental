// pages/recruitment/recruit/companyDetails/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  num(e){
    console.log(e.detail.value)
    var that=this
    this.numlis(e.detail.value,40,function(){
      that.setData({
        name: e.detail.value
      })
    },function(){
      that.setData({
        name: that.data.name
      })
    })
  },
  numlis(value, num,suc, err){
    if (value.length>num){
      return err()
    }
    suc()
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