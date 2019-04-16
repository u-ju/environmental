// pages/businessProductAdd/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
var Promise = require('../../utils/es6-promise.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    upload_picture_list:[],
    xqtu:[],
    url: "shopSettled_goodsStore"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this
    if (options.spu_id){
      this.setData({
        spu_id: options.spu_id,
        shop_id: options.id
      })
      util.getJSON({ apiUrl: apiurl.shopSettled_goodsShow + "?shop_id=" + that.data.shop_id + "&spu_id=" + that.data.spu_id  }, function (res) {

        var result = res.data.result, upload_picture_list = [], xqtu=[]
        for (var i in result.skus[0]["images"]) {

          upload_picture_list.push({ upload_percent: 100, 'path_server': result.skus[0]["images"][i] })
        }
        xqtu = [{ upload_percent: 100, path_server: result.spu_intro }]
        that.setData({
          result: result,
          spu_name: result.spu_name,
          areaSelectedStr: result.area_name,
          area_id: result.area_id,
          price: result.skus[0]["price"],
          xqtu: xqtu,
          sku_id: result.skus[0]["sku_id"],
          upload_picture_list: upload_picture_list,
          url:'shopSettled_goodsUpdate'
        })
        wx.hideLoading()
      })
    }
    this.setData({
      shop_id: options.id
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
  //选择图片方法
  uploadpic: function (e) {

    var that = this //获取上下文
    var upload_picture_list = that.data.upload_picture_list
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFiles = res.tempFiles
        var promiseArr = []
        for (var i in tempFiles) {

          let promise = new Promise((resolve, reject) => {
            wx.getFileSystemManager().readFile({
              filePath: tempFiles[i]['path'], //选择图片返回的相对路径
              encoding: 'base64', //编码格式
              success: res => { //成功的回调 
                resolve(res)
              },
              fail: function (error) {
                reject(error);
              },
            })
          })
          promiseArr.push(promise)
        }
        Promise.all(promiseArr).then((res) => {
          //对返回的result数组进行处理
          util.loading()
          for (var i in res) {

            tempFiles[i]['path_base'] = 'data:image/png;base64,' + res[i].data
            tempFiles[i]['upload_percent'] = 0
            tempFiles[i]['path_server'] = ''
            console.log(tempFiles[i])
            upload_picture_list.push(tempFiles[i])
          }
          that.setData({
            upload_picture_list: upload_picture_list,
          });
          that.uploadimage()
        })
      }
    })
  },
  //点击上传事件
  uploadimage: function () {
    var page = this
    var upload_picture_list = page.data.upload_picture_list
    //循环把图片上传到服务器 并显示进度       
    for (var j in upload_picture_list) {
      if (upload_picture_list[j]['upload_percent'] == 0) {
        //调用函数
        console.log(upload_picture_list)
        util.upload_file_server(apiurl.upload_image, page, upload_picture_list, j)
      }
    }
  },

  // 删除图片
  deleteImg: function (e) {
    let upload_picture_list = this.data.upload_picture_list;
    let index = e.currentTarget.dataset.index;
    upload_picture_list.splice(index, 1);
    this.setData({
      upload_picture_list: upload_picture_list
    });
  },
  uploadpic1(){
    var that = this //获取上下文
    var xqtu = that.data.xqtu
    //选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        
        var tempFiles = res.tempFiles
        var promiseArr = []
        for (var i in tempFiles) {

          let promise = new Promise((resolve, reject) => {
            wx.getFileSystemManager().readFile({
              filePath: tempFiles[i]['path'], //选择图片返回的相对路径
              encoding: 'base64', //编码格式
              success: res => { //成功的回调 
                resolve(res)
              },
              fail: function (error) {
                reject(error);
              },
            })
          })
          promiseArr.push(promise)
        }
        Promise.all(promiseArr).then((res) => {
          //对返回的result数组进行处理
          util.loading()
          for (var i in res) {

            tempFiles[i]['path_base'] = 'data:image/png;base64,' + res[i].data
            tempFiles[i]['upload_percent'] = 0
            tempFiles[i]['path_server'] = ''
            xqtu.push(tempFiles[i])
          }
          that.setData({
            xqtu: xqtu,
          });
          that.uploadimage1()
        })
      }
    })
  },
  //点击上传事件
  uploadimage1: function () {
    var page = this
    var xqtu = page.data.xqtu    
    for (var j in xqtu) {
      if (xqtu[j]['upload_percent'] == 0) {
        //调用函数
        util.upload_pic(apiurl.upload_image, page, xqtu, j,function(e){
          util.hideLoading()
          page.setData({
            xqtu: e
          });
        }, function (e) {
          page.setData({
            xqtu: e
          });
        })
      }
    }
  },

  // 删除图片
  deleteImg1: function (e) {
    let xqtu = this.data.xqtu;
    let index = e.currentTarget.dataset.index;
    this.setData({
      xqtu: []
    });
  },
  // 上传
  formSubmit(e) {
    var that = this
    var upload_picture_list = that.data.upload_picture_list, images = [], data = e.detail.value;
    for (var i = 0; i < upload_picture_list.length; i++) {
      data['images[' + i + ']'] = upload_picture_list[i]['path_server']
    }
    data.spu_intro = that.data.xqtu[0]['path_server']
    data.area_id = that.data.area_id
    data.shop_id = that.data.shop_id
    if (that.data.sku_id){
      data.sku_id = that.data.sku_id
    }
    that.setData({
      disabled: true
    })

    util.postJSON({ apiUrl: apiurl[that.data.url], data: data }, function (res) {
      var result = res.data.result
      util.alert(res.data.message)
      util.navigateBack()
    }, function () {
      that.setData({
        disabled: false
      })
    }, function () {
      that.setData({
        disabled: false
      })
    })
  },
  choosearea(e) {
    console.log(e)
    this.setData({
      areaSelectedStr: e.detail.areaSelectedStr,
      area_id: e.detail.area_id_val
    })
  },
 
})