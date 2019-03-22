// pages/maintenance_worker/index.js
var QQMapWX = require('../../utils//qqmap-wx-jssdk.min.js');
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visible3:false,
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
    status_name:'',
    url:'jiazheng_userStore',
    post:false,
    image: [
      { title: '营业执照', upload_picture_list: [], text: "点击拍摄/上传图片", id: 0 },
      { title: '缩略图', upload_picture_list: [], text: "点击拍摄/上传图片", id: 0 },
      
    ],
    upload_picture_list: [],
    textareahidden: false,
    intro: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.jiazheng != '' && options.jiazheng !=undefined){
      this.userShow(options.jiazheng)
      
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
    // this.userShow(1)
    this.loadAddress();
    this.tab()
  },
  userShow(id){
    var that = this;
    util.getJSON({ apiUrl: apiurl.jiazheng_userShow + id }, function (res) {
      var result = res.data.result
      var image = [
        { title: '店招上传', upload_picture_list: [{ upload_percent: 100, path_server: '' }], text: "点击拍摄/上传图片", id: 0 },
        { title: '营业执照', upload_picture_list: [{ upload_percent: 100, path_server: '' }], text: "点击拍摄/上传图片", id: 1 },
      ], upload_picture_list = []
      
      image[0]["upload_picture_list"][0]['path_server'] = result.license;
      image[1]["upload_picture_list"][0]['path_server'] = result.thumb
      for (var i in result.images) {

        upload_picture_list.push({ upload_percent: 100, 'path_server': result.images[i] })
      }
      that.setData({
        cate_name: result.cate_name,
        cate_id: result.cate_id,
        areaSelectedStr: result.area_name,
        area_id: result.area_id,
        title: result.title,
        phone: result.phone,
        intro: result.intro,
        status_name: result.status_name,
        url:'jiazheng_userUpdate',
        jiazheng_id: id,
        image: image,
        upload_picture_list: upload_picture_list
      })
      wx.hideLoading()
    })
  },
  tab() {
    var that = this;
    util.getJSON({ apiUrl: apiurl.jiazheng_home }, function (res) {
      var cate_arr = res.data.result.cate_arr
      for (var i in cate_arr) {
        cate_arr[i]["value"] = cate_arr[i]["cate_id"]
        cate_arr[i]["label"] = cate_arr[i]["name"]
      }
      that.setData({
        cate_arr: cate_arr,
      })
      wx.hideLoading()
    })
  },
  formSubmit(e){
    console.log(e)
    var data = e.detail.value, that = this;
    data.area_id = that.data.area_id
    data.cate_id = that.data.cate_id

    data["longitude"] = that.data.longitude
    data["latitude"] = that.data.latitude
    var images = ["license", "thumb"]
    for (var a in that.data.image) {
      if (that.data.image[a].upload_picture_list != '') {
        data[images[a]] = that.data.image[a].upload_picture_list[0]['path_server']
      }
    }
    for (var a in that.data.upload_picture_list) {
      data['images[' + a + ']'] = that.data.upload_picture_list[a]['path_server']
    }
    data["intro"] = this.data.intro

    console.log(data)
    that.setData({
      post: true
    })
    if (that.data.url =='jiazheng_userUpdate'){
      data['jiazheng_id'] = that.data.jiazheng_id
    }
    util.postJSON({ apiUrl: apiurl[that.data.url], data: data }, function (res) {
      that.setData({
        visible3: true,
        post: false
      })
      
    }, function (res) {
      console.log(res.data.message)
      that.setData({
        post: false
      })
      }, function (res) {
        
        that.setData({
          post: false
        })
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
  onOpen1() {
    console.log("sssss")
    this.setData({ visible1: true })
  },
  onClose1() {
    this.setData({ visible1: false })
  },
  onChange1(e) {
    this.setData({ cate_name: e.detail.options.map((n) => n.label).join('-'), cate_id: e.detail.options[e.detail.options.length - 1].cate_id })
    console.log('onChange1', e.detail)
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

  //选择图片方法
  uploadpic: function (e) {
    var that = this //获取上下文
    var upload_picture_list = []
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
          for (var i in res) {
            tempFiles[i]['path_base'] = 'data:image/png;base64,' + res[i].data
            tempFiles[i]['upload_percent'] = 0
            tempFiles[i]['path_server'] = ''
            upload_picture_list.push(tempFiles[i])
          }
          that.setData({
            ['image[' + e.currentTarget.dataset.index + '].upload_picture_list']: upload_picture_list,
          });
          that.uploadimage(e.currentTarget.dataset.index)
        })
      }
    })

  },
  //点击上传事件
  uploadimage: function (index) {
    var page = this
    var upload_picture_list = page.data.image[index].upload_picture_list
    //循环把图片上传到服务器 并显示进度       
    for (var j in upload_picture_list) {
      if (upload_picture_list[j]['upload_percent'] == 0) {
        //调用函数
        page.upload_file_server(apiurl.upload_image, page, upload_picture_list, j, index)
      }
    }
  },
  upload_file_server(url, that, upload_picture_list, j, index) {
    //上传返回值
    var _this = this;
    const upload_task = wx.uploadFile({
      // 模拟https
      url: url, //需要用HTTPS，同时在微信公众平台后台添加服务器地址  
      filePath: upload_picture_list[j]['path'], //上传的文件本地地址    
      name: 'file',
      formData: {
        "image": upload_picture_list[j]['path_base'],
        'source': 'base64'
      },
      header: { "content-type": 'application/x-www-form-urlencoded' },
      //附近数据，这里为路径     
      success: function (res) {
        var data = JSON.parse(res.data);
        // //字符串转化为JSON  

        if (data.status == 200) {
          var filename = data.result.image_url //存储地址 显示
          upload_picture_list[j]['path_server'] = filename

        } else {
          upload_picture_list[j]['path_server'] = filename
        }

        that.setData({
          ['image[' + index + '].upload_picture_list']: upload_picture_list,
        });
        wx.setStorageSync('image' + index, upload_picture_list)
      }
    })
    // 上传 进度方法

    upload_task.onProgressUpdate((res) => {
      upload_picture_list[j]['upload_percent'] = res.progress
      that.setData({
        ['image[' + index + '].upload_picture_list']: upload_picture_list,
      });


    });
  },
  // 删除图片
  deleteImg: function (e) {

    var that = this;

    that.setData({
      ['image[' + e.currentTarget.dataset.index + '].upload_picture_list']: [],
    });
    wx.setStorageSync('image' + e.currentTarget.dataset.index, [])
    // 
  },
  uploadpic1: function (e) {
    var that = this //获取上下文
    var upload_picture_list = that.data.upload_picture_list
    console.log(that.data)
    //选择图片
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
          for (var i in res) {
            tempFiles[i]['path_base'] = 'data:image/png;base64,' + res[i].data
            tempFiles[i]['upload_percent'] = 0
            tempFiles[i]['path_server'] = ''

            console.log(tempFiles[i])
            console.log(upload_picture_list)
            upload_picture_list.push(tempFiles[i])
          }
          that.setData({
            upload_picture_list: upload_picture_list,
          });
          that.uploadimage1()
        })
      }
    })
  },
  //点击上传事件
  uploadimage1: function () {
    var page = this
    var upload_picture_list = page.data.upload_picture_list
    //循环把图片上传到服务器 并显示进度       
    for (var j in upload_picture_list) {
      if (upload_picture_list[j]['upload_percent'] == 0) {
        //调用函数
        util.upload_file_server(apiurl.upload_image, page, upload_picture_list, j, '', 1)
      }
    }
  },

  // 删除图片
  deleteImg1: function (e) {
    let upload_picture_list = this.data.upload_picture_list;
    let index = e.currentTarget.dataset.index;
    upload_picture_list.splice(index, 1);
    this.setData({
      upload_picture_list: upload_picture_list
    });
    wx.setStorageSync('upload_picture_list', upload_picture_list)
    console.log(upload_picture_list)
  },
  // 地区选择
  loadAddress: function (options) {
    var that = this;
    util.hideLoading()
    this.getArea(0, function (array, area) {
      that.setData({
        province: array,
        provinceObjects: area
      });
    });
  },
  cascadePopup: function () {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-in-out',
    });
    this.animation = animation;
    animation.translateY(-285).step();
    this.setData({
      animationData: this.animation.export(),
      maskVisual: 'show'
    });
  },
  cascadeDismiss: function () {
    this.animation.translateY(285).step();
    this.setData({
      animationData: this.animation.export(),
      maskVisual: 'hidden'
    });
  },
  provinceTapped: function (e) {
    // 标识当前点击省份，记录其名称与主键id都依赖它
    var index = e.currentTarget.dataset.index;
    // current为1，使得页面向左滑动一页至市级列表
    // provinceIndex是市区数据的标识
    this.setData({
      provinceName: this.data.province[index],
      regionName: '',
      townName: '',
      provinceIndex: index,
      cityIndex: -1,
      regionIndex: -1,
      townIndex: -1,
      region: [],
      town: []
    });
    var that = this;
    this.getArea(this.data.provinceObjects[index]["area_id"], function (array, area) {
      that.setData({
        cityName: '请选择',
        city: array,
        cityObjects: area
      });
      that.setData({
        current: 1
      });
    });
  },
  cityTapped: function (e) {
    // 标识当前点击县级，记录其名称与主键id都依赖它
    var index = e.currentTarget.dataset.index;
    // current为1，使得页面向左滑动一页至市级列表
    // cityIndex是市区数据的标识
    this.setData({
      cityIndex: index,
      regionIndex: -1,
      townIndex: -1,
      cityName: this.data.city[index],
      regionName: '',
      townName: '',
      town: []
    });
    var that = this;
    this.getArea(this.data.cityObjects[index]["area_id"], function (array, area) {
      if (area.length == 0) {
        var areaSelectedStr = that.data.provinceName + that.data.cityName;
        that.setData({
          areaSelectedStr: areaSelectedStr,
          area_id: that.data.cityObjects[index]["area_id"]
        });
        that.cascadeDismiss();
        return;
      }
      that.setData({
        regionName: '请选择',
        region: array,
        regionObjects: area
      });
      // 确保生成了数组数据再移动swiper
      that.setData({
        current: 2
      });
    });
  },
  regionTapped: function (e) {
    // 标识当前点击镇级，记录其名称与主键id都依赖它
    var index = e.currentTarget.dataset.index;
    // current为1，使得页面向左滑动一页至市级列表
    // regionIndex是县级数据的标识
    this.setData({
      regionIndex: index,
      townIndex: -1,
      regionName: this.data.region[index],
      townName: ''
    });
    var that = this;
    this.getArea(this.data.regionObjects[index]["area_id"], function (array, area) {
      if (area.length == 0) {
        var areaSelectedStr = that.data.provinceName + that.data.cityName + that.data.regionName;
        that.setData({
          areaSelectedStr: areaSelectedStr,
          area_id: that.data.regionObjects[index]["area_id"]
        });
        that.cascadeDismiss();
        return;
      }
      that.setData({
        townName: '请选择',
        town: array,
        townObjects: area
      });
      // 确保生成了数组数据再移动swiper
      that.setData({
        current: 3
      });
    });
  },
  townTapped: function (e) {
    // 标识当前点击镇级，记录其名称与主键id都依赖它
    var index = e.currentTarget.dataset.index;
    var that = this;
    // townIndex是镇级数据的标识
    this.setData({
      townIndex: index,
      townName: this.data.town[index]
    });
    var areaSelectedStr = this.data.provinceName + this.data.cityName + this.data.regionName + this.data.townName;
    this.setData({
      areaSelectedStr: areaSelectedStr,
      area_id: that.data.townObjects[index]["area_id"]
    });
    wx.setStorageSync('areaSelectedStrt', areaSelectedStr)
    wx.setStorageSync('area_idt', that.data.townObjects[index]["area_id"])
    this.cascadeDismiss();
  },
  currentChanged: function (e) {
    // swiper滚动使得current值被动变化，用于高亮标记
    var current = e.detail.current;
    this.setData({
      current: current
    });
  },
  changeCurrent: function (e) {
    // 记录点击的标题所在的区级级别
    var current = e.currentTarget.dataset.current;
    this.setData({
      current: current
    });
  },
  getArea: function (pid, cb) {
    var that = this;
    // console.log(pid)
    wx.request({
      url: apiurl.area + pid, //仅为示例，并非真实的接口地址

      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        // console.log(res.data)
        var area = res.data.result.list, array = []
        for (var i = 0; i < area.length; i++) {
          array[i] = area[i]['name'];
        }
        cb(array, area)
      }
    })
  },
  xiugai() {
    this.setData({
      disabled1: false
    })
  },
})