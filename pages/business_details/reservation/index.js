// pages/business_details/reservation/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:[0,0,0,0],
    choose:[]
  },
  choose(e){
    var active = this.data.active,
        choose = this.data.choose
    active[e.currentTarget.dataset.id] = e.currentTarget.dataset.index
    choose[e.currentTarget.dataset.id] = e.currentTarget.dataset.key
    this.setData({
      active: active,
      choose: choose
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var reservation =  JSON.parse(options.reservation)
    console.log(reservation)
    var choose = [reservation.person[0]["key"], reservation.date[0]["key"], reservation.time[0], reservation.room[0]]
    this.setData({
      reservation: reservation,
      choose: choose
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