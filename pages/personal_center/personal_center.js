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
    // item1:[
    //   { title: "手机", value: "", url: "../phone/phone", or:"../phone_new/phone_new"},
    //   { title: "我的积分", value: "", url: "../my_gold/my_gold?gold=1"},
    //   { title: "我的环保金", value: "", url:"../my_gold/my_gold" },
    //   { title: "上门回收订单", value: "", url:"../home_orders/home_orders" },
    //   { title: "我的二维码", value: "", url: "../qrcode/qrcode" },
    //   { title: "垃圾二维码", value: "", url: "../qrcode/qrcode" },
    //   { title: "分拣中心", value: "", url: "../edcs/edcs", qrcode: '', is_sorter: ''  },
    //   { title: "帮助中心", value: "", url: "../help_center/help_center", qrcode: '' },
    // ],
    // item2:[
      // { title: "关于我们", value: "", url: "../about/about" },
      // { title: "商家入驻", value: "", url: "../tenantsIndex/index"},
      // { title: "实名认证", value: "", url: "../phone/phone?type=1", is_rm:0},
      // { title: "消息中心", value: "", url: "../message/message"},
      // { title: "产品分期", value: "", url: "../installment/installment"},
      // { title: "申请环保袋", value: "", url: "../application_bag/application_bag" },
      // { title: "设置", value: "", url: "../setting/setting" },
      // { title: "环保金兑换环保袋", value: "", url: "../ecofer/ecofer" },
    // ],
    // item1:[
    //   { title: "帮助中心", value: "", url: "../help_center/help_center" },
    //   { title: "绑定手机", value: "", url: "../phone/phone",},
    //   { title: "我的积分", value: "", url: "../my_integral/index"},
    //   { title: "我的环保金", value: "", url:"../my_gold/my_gold" },
    //   { title: "我的货款", value: "", url: "../my_paymentGoods/index" },
    //   { title: "实名认证", value: "", url: "../phone/phone?type=1" },
    //   { title: "我的发布", value: "", url: "../my_release/index" },
    //   { title: "我的订单", value: "", url: "../order/index" },
    //   { title: "分期还款", value: "", url: "../installment_repayment/index" },
    // ],
    // item2:[
    //   { title: "回收员上门订单", value: "", url: "../home_orders/home_orders?fill=true", },
    //   { title: "垃圾投放记录", value: "", url: "../cumulative_delivery/cumulative_delivery", },
    //   { title: "上门回收订单", value: "", url: "../home_orders/home_orders", },
    //   { title: "环保大使", value: "", url: "../agent/index" },
    //   { title: "我的银行卡", value: "", url: "../my_bankcard/index" },
    //   { title: "收货地址", value: "", url: "../address/index" },
    //   { title: "设置", value: "", url: "../setting/setting" },
    // ],
    user:[],
    result:{},
    tabbarid:2,
    tag_list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    // console.log(util.getToken())
    
  },
  init(){
    var that = this, item1 = that.data.item1, item2 = that.data.item2;
    util.getJSON({ apiUrl: apiurl.user }, function (res) {
      var result = res.data.result
      var tag_list = result.tag_list
      for (var i in result.tag_list){
          if (!result.tag_list[i]["value"]&&result.tag_list[i]["key"]=='mobile'){
            result.tag_list[i]['control']['control'] ='../phone_new/phone_new'
          }
          if (tag_list[i]["key"] == 'realname'){
            var jishu = i
            util.getJSON({ apiUrl: apiurl.realname }, function (res) {
              if (res.data.result.status != -1) {
                tag_list[jishu]['control']['control'] = '../realname_suc/index?result=' + JSON.stringify(res.data.result)
              }
              that.setData({
                tag_list: tag_list
              })
            })
          }
        // }
      }
      // console.log(result.tag_list)
      that.setData({
        result: result,
        tag_list: result.tag_list,
      })

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
    wx.chooseImage({
      sizeType: ['compressed'],
      ourceType: ['album', 'camera'],
      count: 1,
      success(res) {
        const tempFilePaths = res.tempFilePaths;
        // 只能选择一张图片进行上传
        if (tempFilePaths.length != 1) {
          wxUtil.info_dialog("不允许多图上传");
          return;
        }
        var tempFilesSize = res.tempFiles[0].size;
        // console.log(tempFilesSize)
        if (tempFilesSize <= 2000000) {//图片小于或者等于2M时 可以执行获取图片
          if (that.allowUploadFormat(tempFilePaths)) {
            // console.log(' ----- 验证后 ----- ')
            // console.log(tempFilePaths[0])
            const src = res.tempFilePaths[0]
            wx.navigateTo({
              url: `../tailor/tailor?src=${src}`
            })

          } else {
            wxUtil.info_dialog("上传头像格式不合法!")
          }
        } else {
          wxUtil.info_dialog("上传图片不能大于2M!")
        }
      }
    })
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
    if (e.currentTarget.dataset.link.length == 0) {
      return false
    }
    var url = e.currentTarget.dataset.link.control
    if (JSON.stringify(e.currentTarget.dataset.link.params) != "{}") {
      for (var i in e.currentTarget.dataset.link.params) {
        console.log(i, e.currentTarget.dataset.link.params[i])
        url = url + "?" + i + "=" + e.currentTarget.dataset.link.params[i]
      }
    }
    
    // console.log(url)
    wx.navigateTo({
      url: url,
    })
    // util.loading()
    // var url = e.currentTarget.dataset.url
    // if (e.currentTarget.dataset.value == "" && e.currentTarget.dataset.or) {
    //   url = e.currentTarget.dataset.or
    // }
    // if (e.currentTarget.dataset.is_sorter==0){
    //   return util.alert("你还不是分拣员")
    // }
    // wx.navigateTo({
    //   url: url,
    // })
  },
  tabarUrl(e) {
    // console.log(e);
    if (this.data.tabbarid != e.currentTarget.dataset.id) {
      wx.redirectTo({
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