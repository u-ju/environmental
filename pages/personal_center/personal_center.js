// pages/personal_center/personal_center.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
var template = require('../../Components/tab-bar/tab-bar.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:[],
    result:{},
    tabbarid:2,
    tag_list:[],
    badge:{},
    background:'',
    length:2,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  init(){
    var that = this, item1 = that.data.item1, item2 = that.data.item2;
    util.getJSON({ apiUrl: apiurl.user }, function (res) {
      var result = res.data.result
      
      var user_info = result.user_info, tag_arr= result.tag_arr
      if (!user_info.mobile.name){
        user_info.mobile['control']['control'] = '../phone_new/phone_new';
        for (var i in tag_arr){
          for (var j in tag_arr[i]['children']){
            if (tag_arr[i]['children'][j]['control']['key'] =='front_bind_mobile'&&tag_arr[i]['children'][j].attach.is_bind==0){
              tag_arr[i]['children'][j]['control']['control'] = '../phone_new/phone_new';
            }
          }
        }
      }
      
      that.setData({
        result: result,
        user_info: result.user_info,
        tag_arr: result.tag_arr,
        l_two: result.l_two||"",
        // surplus: result.l_three.length % 3,
        // surplusnum: parseInt(result.l_three.length % 3),
        // tag_list: result.tag_list,
        // badge: result.badge,
        // background: result.background
      })
      getApp().globalData.userInfo = result.user_info
      util.hideLoading()
    })
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    template.tabbar("tabBar", 2, this) //0表示第一个tabbar
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1].route;
    if (!wx.getStorageSync('token') && wx.getStorageSync('pagesroute') == currPage) return wx.setStorageSync('pagesroute', '')
    
    if (app.globalData.config.length == 0) {
      util.loading()
    }
    this.init()
  },
  show() {//不跳页面
    util.scan()
  },
  /**
     * 小程序用户头像上传
     */
  uploadHeadPhoto: function () {
    // console.log('upload photo .... ');
    var that = this;
    getApp().globalData.avatar = this.data.l_one.avatar
    wx.navigateTo({
      url: `../avatar/index`
    })
    // wx.chooseImage({
    //   sizeType: ['compressed'],
    //   ourceType: ['album', 'camera'],
    //   count: 1,
    //   success(res) {
    //     const tempFilePaths = res.tempFilePaths;
    //     // 只能选择一张图片进行上传
    //     if (tempFilePaths.length != 1) {
    //       wxUtil.info_dialog("不允许多图上传");
    //       return;
    //     }
    //     var tempFilesSize = res.tempFiles[0].size;
    //     // console.log(tempFilesSize)
    //     if (tempFilesSize <= 2000000) {//图片小于或者等于2M时 可以执行获取图片
    //       if (that.allowUploadFormat(tempFilePaths)) {
    //         // console.log(' ----- 验证后 ----- ')
    //         // console.log(tempFilePaths[0])
    //         const src = res.tempFilePaths[0]
    //         wx.getFileSystemManager().readFile({
    //           filePath: src, //选择图片返回的相对路径
    //           encoding: 'base64', //编码格式
    //           success: res => { //成功的回调 
    //             console.log(res)
    //             const data = res.data
    //             wx.navigateTo({
    //               url: `../tailor/tailor?src=${src}&data=${data}`
    //             })

    //           },
    //           fail: function (error) {
    //           },
    //         })
           
    //       } else {
    //         wxUtil.info_dialog("上传头像格式不合法!")
    //       }
    //     } else {
    //       wxUtil.info_dialog("上传图片不能大于2M!")
    //     }
    //   }
    // })
  },
  /**
     * 上传头像格式验证
     * @param tempFiles 头像图片
     * @returns {boolean} true 检测通过 false 检测失败
     */
    allowUploadFormat: function (tempFiles = []) {
      // 允许上传的图片格式
      var allow_head_photo = ['.jpg', '.jpeg', '.png'];

      for (let idx in tempFiles) {
        if (tempFiles[idx].match(/.jpg|.png|.jpeg/)) {
          var upload_pic_ext = tempFiles[idx].match(/.jpg|.png|.jpeg/)[0].trim();
          var allow_format = allow_head_photo.join("");
          if (allow_format.indexOf(upload_pic_ext) >= 0) {
            return true;
          }
        }
        return false;
      }
    },
  name(e){
    // console.log(e.currentTarget.dataset.name)
    wx.navigateTo({
      url: '../modify_nickname/modify_nickname?name=' + e.currentTarget.dataset.name,
    })
  },
  link(e){
    // console.log(e)
    if (!e.currentTarget.dataset.link){
      return false
    }
    if (JSON.stringify(e.currentTarget.dataset.link.length) == "{}") {
      return false
    }
    // return console.log(e.currentTarget.dataset.link)
    if (e.currentTarget.dataset.link.key =='front_realname') {
      util.loading()
      return util.getJSON({ apiUrl: apiurl.realname }, function (res) {
        var url = e.currentTarget.dataset.link.control +'?1=1'
        
        if (res.data.result.status != -1) {
          url = '../realname_suc/index?result=' + JSON.stringify(res.data.result)
        }
        if (JSON.stringify(e.currentTarget.dataset.link.params) != "{}") {
          for (var i in e.currentTarget.dataset.link.params) {
            console.log(i, e.currentTarget.dataset.link.params[i])
            url = url + "&" + i + "=" + e.currentTarget.dataset.link.params[i]
          }
        }
        wx.navigateTo({
          url: url,
          fail: function () {
            util.alert('该功能暂未开放，敬请期待')
          },
        })
      })
    }

    var url = e.currentTarget.dataset.link.control +'?1=1'
    
    if (JSON.stringify(e.currentTarget.dataset.link.params) != "{}") {
      for (var i in e.currentTarget.dataset.link.params) {
        url = url + "&" + i + "=" + e.currentTarget.dataset.link.params[i]
      }
    }
    if (JSON.stringify(e.currentTarget.dataset.attach) != "{}") {
      for (var j in e.currentTarget.dataset.attach) {
        url = url + "&" + j + "=" + e.currentTarget.dataset.attach[j]
        if (j=="area_arr"){
          url = url + "&area_arr=" + JSON.stringify(e.currentTarget.dataset.attach['area_arr'])
        }
      }
    }
    if (e.currentTarget.dataset.link.key == 'front_share_home') {
      return util.getJSON({ apiUrl: apiurl.share }, function (res) {
        var result = res.data.result
        // url = url + "&result=" + JSON.stringify(result)
        getApp().globalData.front_share_home = result
        util.hideLoading()
        wx.navigateTo({
          url: url,
          fail: function () {
            util.alert('该功能暂未开放，敬请期待')
          },
        })
      }, function (e) {
        return
      })
    }
    wx.navigateTo({
      url: url,
      fail: function () {
        util.alert('该功能暂未开放，敬请期待')
      },
    })
  },
  tabarUrl(e) {
    // console.log(e);
    if (this.data.tabbarid != e.currentTarget.dataset.id) {
      wx.reLaunch({
        url: e.currentTarget.dataset.url,
      })
    }
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