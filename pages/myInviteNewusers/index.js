const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
var qrCodeJS = require('../../utils/qrcode.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[0],
    visible3: false,
    value: "https://wyhb.dev.zgwyhb.com/qrcode/WyJzaGFyZSIsMl0",
    fgColor: 'black',
    // '我邀请的用户', '我邀请的商家'
    tab: [
      { name: '我邀请的用户', url: 'shareUserIndex' },
      { name: '我邀请的商家', url: 'shareShopIndex' },
    ],
    curre: "shareUserIndex"
  },
  tabcur(e){
    if (e.currentTarget.dataset.url==this.data.curre){
      return
    }
    this.setData({
      curre: e.currentTarget.dataset.url
    })
    this.init()
  },
  onLoad: function (options) {
    this.setData({
      avatar: '../../images/logozmn.jpg',
      // getApp().globalData.userInfo.avatar ||
      logo: '../../images/logoi.png'
      // getApp().globalData.config.logo
    })
  },
  init(page = 1) {
    var that = this;

    util.getJSON({ apiUrl: apiurl[that.data.curre] + "?page=" + page }, function (res) {
      var result = res.data.result
      var list = result.list
      // if (page != 1) {
      //   list = that.data.list.concat(list)
      // }
      // list=[
      //   { nickname: 'dsadsa', effect_time: '201909090', status_name: 'cdai', avatar:'../../images/logoi.png'}
      // ]
      that.setData({
        list: list,
        page: result.page,
      })
      util.hideLoading()
      if (wx.getStorageSync("popoutccs")==1){
        return wx.setStorageSync('popoutccs', '')
      }
      that.share()
      
    })
  },
  open3(e) {
    if (!this.data.value){
      return util.alert1(this.data.share_qrcode_desc)
    }
    qrCodeJS.qrApi.draw(this.data.value, "logoQRCode", 200, 200, null, this.data.avatar); 
    this.setData({
      visible3: true
    })

  },
  close3() {
    this.setData({
      visible3: false,
    })
  },
  onClose3() {
    this.setData({
      visible3: false,
    })
  },
  shop_info(e){
    wx.navigateTo({
      url: '../business_details/business_details?id=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  share(){
    var that = this;
    util.getJSON({ apiUrl: apiurl.share }, function (res) {
      var result = res.data.result
      // url = url + "&result=" + JSON.stringify(result)
      getApp().globalData.front_share_home = result
      that.setData({
        result: result,
        value: result.share_qrcode,
        stat: result.stat,
        share_qrcode_desc: result.share_qrcode_desc
      })
    
    }, function (e) {
      return
    })
  },
  onShow: function () {
    // util.loading()
    var that = this;
    var result = getApp().globalData.front_share_home
    this.setData({
      result: result,
      value: result.share_qrcode,
      stat: result.stat,
      share_qrcode_desc: result.share_qrcode_desc
    })
    that.init()
    
  },
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    util.getJSON({ apiUrl: apiurl[that.data.curre] + "?page=1"  }, function (res) {
      var result = res.data.result
      console.log(result)
      that.setData({
        news: result.list,
        page: result.page,
        last: false
      })
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
    })

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    // 页数+1
    if (Number(that.data.page.current_page) != Number(that.data.page.last_page)) {
      that.init( Number(that.data.page.current_page) + 1)
    } else {
      that.setData({
        last: true
      })
      wx.hideLoading()
    }


  },
  previewImage(e){
    const that = this
    wx.canvasToTempFilePath({
      canvasId: 'logoQRCode',
      success: (res1) => {
        wx.showModal({
          title: '保存图片',
          content: '确定要保存图片？',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {
              wx.saveImageToPhotosAlbum({
                filePath: res1.tempFilePath,
                success(res) {
                  wx.showToast({
                    title: '保存成功',
                    icon: 'none',
                    duration: 2000,
                  });
                }
              })
            }
          }, fail: function (res) {
            console.log(11111)
          }
        })
      }
    }, that)
  }
})