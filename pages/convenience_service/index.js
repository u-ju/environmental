// pages/convenience_service/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // items:[
    //   { images: '../../images/bm_00.png', title: '大件\n垃圾回收', url: '../place_order/place_order' },
    //   { images: '../../images/bm_3.png', title: '求职招聘', url: '' },
    //   { images: '../../images/bm_8.png', title: '租房服务', url: '' },
    //   { images: '../../images/bm_15.png', title: '维修服务', url: '' },
    //   { images: '../../images/bm_14.png', title: '家政服务', url: '../business/index?type=housekeeping' },
    //   { images: '../../images/bm_17.png', title: '居家养老', url: '' },
    //   { images: '../../images/bm_17.png', title: '失物招领', url: '' },
    //   { images: '../../images/bmb_7.png', title: '法律援助', url: '' },
    //   { images: '../../images/bm_2.png', title: '社保服务', url: '' },

    //   { images: '../../images/bm_1.png', title: '水电气缴纳', url: '../payment/index' },
      
    //   // { images: '../../images/bm_0.png', title: '商务服务', url:'../business/index?type=business'},
    //   // { images: '../../images/bm_1.png', title: '水电气缴纳', url: '../payment/index' },
    //   // { images: '../../images/bm_2.png', title: '社保服务', url: '' },
    //   // { images: '../../images/bm_3.png', title: '求职招聘', url: '' },
    //   // { images: '../../images/bm_4.png', title: '餐饮服务', url: '../catering/index' },
    //   // { images: '../../images/bm_5.png', title: '休闲娱乐', url: '' },
    //   // { images: '../../images/bm_6.png', title: '汽车服务', url: '' },
    //   // { images: '../../images/bm_7.png', title: '装修建材', url: '' },
    //   // { images: '../../images/bm_8.png', title: '租房服务', url: '' },
    //   // { images: '../../images/bm_9.png', title: '农林牧副渔', url: '' },
    //   // { images: '../../images/bm_10.png', title: '招商加盟', url: '' },
    //   // { images: '../../images/bm_11.png', title: '旅游服务', url: '' },
    //   // { images: '../../images/bm_12.png', title: '教育培训', url: '' },
    //   // { images: '../../images/bm_13.png', title: '批发采购', url: '' },
    //   // { images: '../../images/bm_14.png', title: '家政服务', url: '../business/index?type=housekeeping' },
    //   // { images: '../../images/bm_15.png', title: '维修服务', url: '' },
    //   // { images: '../../images/bm_16.png', title: '婚庆摄影', url: '' },
    //   // { images: '../../images/bm_17.png', title: '失物招领', url: '' },
    // ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.children){
      this.setData({
        items: JSON.parse(options.children)
      })
    }
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
    if (!e.currentTarget.dataset.control){
      wx.showModal({
        title: '提醒',
        content: '该功能尚未开放，敬请期待',
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
    }else{
      var controlContrast = getApp().globalData.controlContrast, url = '';
      for (var i in controlContrast) {
        if (controlContrast[i].control == e.currentTarget.dataset.control) {
          url = controlContrast[i].contrast

        }
      }
      wx.navigateTo({
        url: url,
      })
    }
    
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