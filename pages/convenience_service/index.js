// pages/convenience_service/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      bgi: getApp().globalData.front_tshop_index.bgi,
      law_hall: getApp().globalData.front_tshop_index.law_hall,
      more: getApp().globalData.front_tshop_index.more,
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
  link(e){
    if (e.currentTarget.dataset.link.length == 0) {
      return wx.showModal({
        title: '提醒',
        content: '该功能加班加点研发中，敬请期待',
        cancelText: '否',
        cancelColor: '#2EB354',
        confirmText: '是',
        confirmColor: '#444444',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else {
            console.log('用户点击取消')
          }

        }
      })
    }
    var url = e.currentTarget.dataset.link.control+'?1=1'
    if (JSON.stringify(e.currentTarget.dataset.link.params) != "{}") {
      for (var i in e.currentTarget.dataset.link.params) {
        if (i =='imgsrc'){
          getApp().globalData.imgsrc = e.currentTarget.dataset.link.params.imgsrc
        }else{
          url = url + "&" + i + "=" + e.currentTarget.dataset.link.params[i]
        }
      }
    }
    if (e.currentTarget.dataset.children != '' && e.currentTarget.dataset.children != undefined) {
      url = url + "&children=" + JSON.stringify(e.currentTarget.dataset.children)
    }
    wx.navigateTo({
      url: url,
      fail(){
        wx.navigateTo({
          url: '../unopen/index',
        })
      }
    })
    
    
    // if (!e.currentTarget.dataset.url){
    //   wx.showModal({
    //     title: '提醒',
    //     content: '该功能尚未开放，敬请期待',
    //     cancelText: '否',
    //     cancelColor: '#2EB354',
    //     confirmText: '是',
    //     confirmColor: '#444444',
    //     success: function (res) {
    //       if (res.confirm) {
    //         console.log('用户点击确定')
    //       } else {
    //         console.log('用户点击取消')
    //       }

    //     }
    //   })
    // }else{
    //   wx.navigateTo({
    //     url: e.currentTarget.dataset.url,
    //   })
    // }
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