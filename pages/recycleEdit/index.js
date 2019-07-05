// pages/maintenance_worker/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visible3: false,
    // 地址
    current: 0,
    province: [],
    city: [],
    region: [],
    town: [],
    provinceObjects: [],
    cityObjects: [],
    regionObjects: [],
    townObjects: [],
    areaSelectedStr: '',
    area_id: 0,
    maskVisual: 'hidden',
    provinceName: '请选择',
    status_name: '',
    url: 'recycle_userStore',
    post: false,

    textareahidden: false,
    intro: '',
    choose: [],
    choosename: [],
    chooset: [],
    choosenamet: [],
    upload_picture_list: [],
    recycle_id: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  // inputttt(e){
  //   wx.setStorageSync('titlett', e.detail.value)
  // },
  show() {
    this.setData({
      textareahidden: 1
    })
  },
  unshow() {
    this.setData({
      textareahidden: false
    })
  },
  input(e) {
    this.setData({
      intro: e.detail.value
    })
  },
  onLoad: function (options) {
   
    if (options.recycle != '' && options.recycle != undefined && options.recycle != 0) {
      this.userShow()

    }
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: (res) => {
        let latitude = res.latitude;
        let longitude = res.longitude;
        this.setData({
          longitude: longitude,
          latitude: latitude,
        })
      }
    });
    // this.loadAddress();
    // this.tab()
  },
  userShow(id) {
    var that = this;
    util.getJSON({ apiUrl: apiurl.recycle_userShow }, function (res) {
      var result = res.data.result, upload_picture_list = []
      if (result.thumb) {
        upload_picture_list.push({ upload_percent: 100, 'path_server': result.thumb })
      }

      that.setData({
        // choose: result.cate_tag || [],
        // choosename: result.cate_tag_name || [],
        // chooset: result.cate_tag || [],
        // choosenamet: result.cate_tag_name || [],
        title: result.title || '',
        contact: result.contact || '',
        address: result.address || '',
        upload_picture_list: upload_picture_list,
        areaSelectedStr: result.area_name || '',
        area_id: result.area_id || '',

        intro: result.intro || '',
        status_name: result.status_name || '',
        url: 'recycle_userUpdate',
        recycle_id: result.id
      })
      wx.hideLoading()
    })
  },
  tab() {
    var that = this;
    util.getJSON({ apiUrl: apiurl.recycle_home }, function (res) {
      var cate_arr = res.data.result.cate_arr
      for (var i in cate_arr) {
        cate_arr[i]["value"] = cate_arr[i]["id"]
        cate_arr[i]["label"] = cate_arr[i]["name"]
      }
      that.setData({
        cate_arr: cate_arr,
      })
      wx.hideLoading()
    })

  },
  formSubmit(e) {

    var data = e.detail.value, that = this;
    data.area_id = that.data.area_id
    // for (var i in that.data.chooset) {
    //   data['cate_tag[' + i + ']'] = that.data.chooset[i]
    // }
    that.setData({
      post: true
    })
    data["intro"] = this.data.intro
    if (that.data.url == 'recycle_userUpdate') {
      data['id'] = that.data.recycle_id
    }
    data['thumb'] = that.data.upload_picture_list[0]['path_server']
    util.postJSON({ apiUrl: apiurl[that.data.url], data: data }, function (res) {
      util.alert(res.data.message)
      setTimeout(function () {
        wx.reLaunch({
          url: '../index/index',
          success() {
            that.setData({
              visible3: true,
              post: false
            })
          }
        })
      }, 3000)
    }, function (res) {

      // if (res.data.message == "更新成功") {
      //   // wx.navigateBack()
      // }
      that.setData({
        post: false
      })
    }, function (res) {

      that.setData({
        post: false
      })
    })
  },
  choosearea(e) {

    this.setData({
      areaSelectedStr: e.detail.areaSelectedStr,
      area_id: e.detail.area_id_val
    })
  },
  uploadpic1(e) {
    var that = this;
    var index = e.currentTarget.dataset.indexnum;

    util.uploadpic(that, 1, 'upload_picture_list', '', function (images) {
     
      that.setData({
        upload_picture_list: images,
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
  // 删除图片
  deleteImg1: function (e) {
    let upload_picture_list = this.data.upload_picture_list;
    this.setData({
      upload_picture_list: []
    });
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

  open3() {
    this.setData({
      visible3: true,
    })
  },
  close3() {
    this.setData({
      visible3: false,
    })
    wx.navigateBack()
  },

  xiugai() {
    this.setData({
      disabled1: false
    })
  },
  onOpen1() {
    this.setData({ visible1: true })
  },
  close1() {
    this.setData({ visible1: false })
  },
  choose(e) {

    var choose = this.data.choose, choosename = this.data.choosename
    if (choose.indexOf(e.currentTarget.dataset.id) == -1) {
      choose.push(e.currentTarget.dataset.id)
      choosename.push(e.currentTarget.dataset.name)
    } else {
      choose.splice(choose.indexOf(e.currentTarget.dataset.id), 1)
      choosename.splice(choosename.indexOf(e.currentTarget.dataset.id), 1)
    }
    this.setData({
      choose: choose,
      choosename: choosename
    })
  },
  ch_del() {
    this.setData({
      visible1: false,
      choose: util.copyarr(this.data.chooset),
      choosename: util.copyarr(this.data.choosenamet)
    })
  },
  ch_true() {
    this.setData({
      visible1: false,
      chooset: util.copyarr(this.data.choose),
      choosenamet: util.copyarr(this.data.choosename)
    })
  },
})