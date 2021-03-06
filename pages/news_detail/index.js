// pages/news_detail/index.js
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
    news_id: 0,
    textarea: '',
    reply_id: '',
    page: {},
    list: [],
    nodes: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this
    that.setData({
      news_id: options.id,
      official_qr: app.globalData.config.official_qr
    })
    util.loading()
    that.index()
    that.initreplyIndex()
    that.earnIntegral()
  },
  //提示框
  showAlter: function (name, value) {
    new app.ToastPannel();
    this.showt(name, value);
  },
  index() {
    var that = this
    util.getJSON({ apiUrl: apiurl.news_show + "?news_id=" + that.data.news_id }, function (res) {
      if (res.data.result.content_source == "html") {
        var article = res.data.result.content;
        WxParse.wxParse('article', 'html', article, that, 5);

      }
      util.hideLoading()
      // if (util.isempty(res.data.result.award)) {
        // setTimeout(function(){
        //   that.showAlter(res.data.result.award.desc, res.data.result.award.value)
        // },200)
      // }
      that.setData({
        result: res.data.result,
        nodes: res.data.result.content
      });
    })
  },
  initreplyIndex(page = 1) {
    var that = this
    util.getJSON({ apiUrl: apiurl.news_replyIndex + "?news_id=" + that.data.news_id + "&page=" + page }, function (res) {
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
      
    })
  },
  // 赚积分
  earnIntegral() {
    var that = this;
    util.postJSON({ apiUrl: apiurl.walletearnIntegral, data: { source: "read" } }, function (res) {
      var result = res.data.result
      if (util.isempty(res.data.result.award)) {
        setTimeout(function () {
          new app.ToastPannel();
          that.showt(res.data.result.award.desc, res.data.result.award.value);
        }, 200)
      }
    })
  },

  lookallhuifu(e, page = 1) {
    var that = this;
    console.log(e)
    if (that.data.list[e.currentTarget.dataset.index].page.current_page && Number(that.data.list[e.currentTarget.dataset.index].page.current_page) != Number(that.data.list[e.currentTarget.dataset.index].page.last_page)) {
      page = that.data.list[e.currentTarget.dataset.index].page.current_page + 1
    }
    util.getJSON({ apiUrl: apiurl.news_replyIndex + "?news_id=" + that.data.news_id + "&parent_id=" + e.currentTarget.dataset.reply_id + "&page=" + page }, function (res) {
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
    // if (!e.currentTarget.dataset.praise) {
    //   
    //   util.postJSON({ apiUrl: apiurl.news_praiseStore, data: { news_id: that.data.news_id, praise: 1 } }, function (res) {
    //     var result = that.data.result
    //     result.praise = 1
    //     result.like = result.like-0 + 1
    //     that.setData({
    //       result: result
    //     })
    //   })
    // }
    var that = this;
    util.postJSON({ apiUrl: apiurl.news_praiseStore, data: { news_id: that.data.news_id } }, function (res) {
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
    that.earnIntegral()
  },
  collect(e) {
    var that = this;
    var collect_list_count = this.data.result.collect_list_count, collect = this.data.result.collect,  result = this.data.result
    result['collect_list_count'] = collect == 0 ? collect_list_count - 0 + 1 : collect_list_count - 1
    result['collect'] = collect == 0 ? 1 : 0
    this.setData({
      result: result
    })
    util.postJSON({
      apiUrl: apiurl.collectUpdate,
      data: { source: 'news', source_id: that.data.news_id }
    }, function (res) {
      console.log(res)
    })
    that.earnIntegral()
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
      var data = { news_id: that.data.news_id, content: e.detail.value.pinglun }
      if (that.data.reply_id) {
        data["parent_id"] = that.data.reply_id
      }
      util.postJSON({ apiUrl: apiurl.news_replyStore, data: data }, function (res) {
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
  share_zzc2() {
    this.setData({
      share_zzc2: !this.data.share_zzc2,
      share_zzc: false
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
  onShareAppMessage: function (res) {
    this.setData({
      share_zzc: !this.data.share_zzc
    })
    var pjdata = {
      id: this.data.news_id
    }
    return util.share('啄木鸟环保', '../dynamic/dynamic&pjdata=' + JSON.stringify(pjdata))
    // return {
    //   title: '啄木鸟环保',
    //   path: '/pages/dynamic/dynamic?id=' + this.data.news_id + "&pjurl='../dynamic/dynamic?id='" + this.data.news_id,

    //   success: function (res) {
    //     // 转发成功
    //     wx.showToast({
    //       title: "分享成功",
    //       icon: 'success',
    //       duration: 2000
    //     })
    //   },
    //   fail: function (res) {
    //     // 分享失败
    //   },
    // }
  },
  savepic() {
    var that = this
    wx.getImageInfo({
      src: that.data.official_qr,
      // src: '../../images/erwm.jpg',
      success: function (res) {
        console.log(res.path)
        wx.getSetting({
          success(res1) {
            console.log(res1)
            if (!res1.authSetting['scope.writePhotosAlbum']) {
              wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success() {
                  wx.saveImageToPhotosAlbum({
                    filePath: res.path,
                    success(result) {
                      console.log(result)
                    }
                  })
                }
              })
            } else {
              console.log(res.path)
              wx.saveImageToPhotosAlbum({
                filePath: res.path,
                success(res2) {
                  wx.showToast({
                    title: '保存成功',
                    icon: 'none',
                    duration: 2000,
                  });
                },
                fail(e) {
                  console.log(e)
                }
              })

            }
          },
          fail(e) {
            console.log(e)
          }
        })
      }
    })


    // wx.downloadFile({
    //   url: '../../images/erwm.jpg',
    //   success: function (res) {
    //     console.log("下载文件：success");
    //     console.log(res);

    //     // 保存图片到系统相册  
    //     wx.saveImageToPhotosAlbum({
    //       filePath: res.tempFilePath,
    //       success(res) {
    //         console.log("保存图片：success");
    //         wx.showToast({
    //           title: '保存成功',
    //         });
    //       },
    //       fail(res) {
    //         console.log("保存图片：fail");
    //         console.log(res);
    //       }
    //     })
    //   },
    //   fail: function (res) {
    //     console.log("下载文件：fail");
    //     console.log(res);
    //   }
    // })
  }
})