// pages/agriculturalEdit/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
var Promise = require('../../utils/es6-promise.js');
Page({
  data: {

    show: false,//控制下拉列表的显示隐藏，false隐藏、true显示

    selectData: ['1', '2', '3', '4', '5', '6'],//下拉列表的数据

    index: 0,//选择的下拉列表下标
    spec_str:[]
  },

  // 点击下拉显示框

  selectTap() {

    this.setData({

      show: !this.data.show

    });

  },

  // 点击下拉列表

  optionTap(e) {

    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标

    this.setData({

      index: Index,

      show: !this.data.show

    });

  },

  onLoad: function (options) {



  },
  upload(e){
    var that = this;
    this.uploadpic(e, 1, 'spec_str', function (spec_str){
      // console.log(res)
      that.setData({
        spec_str: spec_str,
      });
      for (var j in spec_str) {
        if (spec_str[j]['upload_percent'] == 0) {
          //调用函数
          util.upload_pic(apiurl.upload_image, that, spec_str, j,function(e){
            that.setData({
              spec_str: e,
            });
            util.hideLoading()
          },function(e){
            that.setData({
              spec_str: e,
            });
            console.log(2)
          })
        }
      }
    })
  },
  uploadpic: function (e,num,name,suc) {
    var that = this //获取上下文
    var name = that.data[name]
    //选择图片
    // console.log(e)
    wx.chooseImage({
      count: num,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res)
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
          console.log(res)
          for (var i in res) {
            tempFiles[i]['path_base'] = 'data:image/png;base64,' + res[i].data
            tempFiles[i]['upload_percent'] = 0
            tempFiles[i]['path_server'] = ''
            name.push(tempFiles[i])
          }
          suc(name)
        })
      }
    })
  },
 

  // 删除图片
  deleteImg: function (e) {
    let arr = this.data[e.currentTarget.dataset.name];
    console.log(e.currentTarget.dataset.name)
    console.log(arr)
    let index = e.currentTarget.dataset.index;
    console.log(index)
    arr.splice(index, 1);
    this.setData({
      [name]: arr
    });
  },



})