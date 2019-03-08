// pages/video_detail/index.js
const app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curr_id: '',
    items: [{
      id: 1,
      src: 'https://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
      poster: ''
    }
    ],
    releaseFocus: false,
    name: 'puju',
    releaseName: '',
    share_zzc: false,
    share_zzc2: false,
    result: [],
    video_id: 0,
    textarea: '',
    reply_id: '',
    page: {},
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options["id"]=3
    var that = this
    that.setData({
      video_id: options.id
    })
    util.loading()
    util.getJSON({ apiUrl: apiurl.video_show + "?video_id=" + options.id }, function (res) {
      if (res.data.result.content_source == "html") {
        var article = res.data.result.content;
        WxParse.wxParse('article', 'html', article, that, 5);
      }

      that.setData({
        result: res.data.result
      });
    })
    that.initreplyIndex()
  },
  initreplyIndex(page = 1) {
    var that = this
    util.getJSON({ apiUrl: apiurl.video_replyIndex + "?video_id=" + that.data.video_id + "&page=" + page }, function (res) {
      var list = res.data.result.list
      for (var i in list) {
        list[i]["huifu"] = false
        list[i]["count"] = []
        list[i]["page"] = {}
      }
      if (page != 1) {
        list = that.data.list.concat(list)
      }
      that.setData({
        list: list,
        page: res.data.result.page
      });
      util.hideLoading()
    })
  },


  lookallhuifu(e, page = 1) {
    var that = this;
    console.log(e)
    if (that.data.list[e.currentTarget.dataset.index].page.current_page && Number(that.data.list[e.currentTarget.dataset.index].page.current_page) != Number(that.data.list[e.currentTarget.dataset.index].page.last_page)) {
      page = that.data.list[e.currentTarget.dataset.index].page.current_page + 1
    }
    util.getJSON({ apiUrl: apiurl.video_replyIndex + "?video_id=" + that.data.video_id + "&parent_id=" + e.currentTarget.dataset.reply_id + "&page=" + page }, function (res) {
      var list1 = res.data.result.list
      var list = that.data.list
      list[e.currentTarget.dataset.index].page = res.data.result.page
      list[e.currentTarget.dataset.index].huifu = true
      list[e.currentTarget.dataset.index].count = that.data.list[e.currentTarget.dataset.index].count.concat(list1)
      console.log(list)
      that.setData({
        list: list
      });

    })
  },
  like(e) {
    if (!e.currentTarget.dataset.praise) {
      var that = this;
      util.postJSON({ apiUrl: apiurl.video_praiseStore, data: { video_id: that.data.video_id } }, function (res) {
        // var result = that.data.result
        // result.praise = 1
        // result.like = result.like - 0 + 1
        // that.setData({
        //   result: result
        // })
        var result = that.data.result
        var praise = that.data.result.praise
        var like = that.data.result.like
        if (praise == 0) {
          praise = 1
          like = like - 0 + 1
        } else {
          praise = 0
          like = like - 1
        }
        result.praise = praise
        result.like = like
        that.setData({
          result: result
        })
      })
    }
  },


  lookall() {
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '加载中',
    })
    // 页数+1
    if (Number(that.data.page.current_page) != Number(that.data.page.last_page)) {
      that.initreplyIndex(Number(that.data.page.current_page) + 1)
    } else {
      that.setData({
        last: true
      })
      wx.hideLoading()
    }
  },
  show: function () {

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.videoContext = wx.createVideoContext('myVideo')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  /**
  * 点击回复
  */
  bindReply: function (e) {
    console.log(e.currentTarget.dataset.releasename)
    var reply_id = ''
    if (e.currentTarget.dataset.reply_id) {
      reply_id = e.currentTarget.dataset.reply_id
    }
    this.setData({
      releaseFocus: true,
      releaseName: e.currentTarget.dataset.releasename,
      reply_id: reply_id
    })

  },
  formSubmit(e) {
    var that = this

    if (e.detail.value.pinglun == '') {
      util.alert('请输入评论内容')
    } else {

      that.setData({
        releaseFocus: false,
      })
      var data = { video_id: that.data.video_id, content: e.detail.value.pinglun }
      if (that.data.reply_id) {
        data["parent_id"] = that.data.reply_id
      }
      util.postJSON({ apiUrl: apiurl.video_replyStore, data: data }, function (res) {
        that.setData({
          textarea: '',
        })
        util.alert('评论成功')
        that.initreplyIndex()
      })
    }
  },
  // 遮罩层隐藏
  hide() {
    this.setData({
      releaseFocus: false
    })
  },
  share_zzc() {
    this.setData({
      share_zzc: !this.data.share_zzc
    })
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
  onShareAppMessage: function (e) {
    
    return {
      title: '奥特利环保',
      path: '/pages/video_detail/index?id=' + that.data.video_id + "&pjurl='../video_detail/index?id='" + that.data.video_id ,
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: "分享成功",
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        // 分享失败
      },
    }
  }
})