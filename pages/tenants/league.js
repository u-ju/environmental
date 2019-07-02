// pages/tenants/league.js
var QQMapWX = require('../../utils//qqmap-wx-jssdk.min.js');

// 实例化API核心类
let qqMap = new QQMapWX({
  key: 'HPNBZ-B426V-CZQPP-UN4R6-QYOF2-MYFU3' // 必填
});
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    post: false,
    options2: [
      {
        value: 'beijing',
        label: '北京',
        isLeaf: false,
      },
      {
        value: 'hangzhou',
        label: '杭州',
        isLeaf: false,
      },
    ],
    value2: [],
    type_val: [
      { name: '便民服务', id: 1 },
      { name: '积分商城', id: 2 },
    ],
    tshop_cate: [],
    shop_cate: [],
    type: '',
    image: [
      { title: '营业执照', upload_picture_list: [], text: "点击拍摄/上传图片", id: 0 },
      { title: '店招上传', upload_picture_list: [], text: "点击拍摄/上传图片", id: 1 },
    ],
    upload_picture_list: [],
    cate_id: '',
    // 地址

    result: [],
    disabled1: false,
    shop_id: '',
    latitude: '',
    longitude: '',
    contact: '',
    title: '',
    address: '',
    intro: '',
    show: false,
    choosed: 1,
    shop_settled: '',
    suggestion: [],
    konwname: '',
    choosead: true
  },
  testcall(e) {
    // // console.log(e)
    util.testjq(e.detail.value, "请输入正确的联系方式", function () {

    })
  },
  uploadvideo(e) {
    var that = this;

    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      success: function (res) {
        util.loading()
        var promiseArr = []
        var tempFile = {}
        tempFile.img = res.thumbTempFilePath;
        tempFile.upload_percent = 0
        //  console.log(res)
        var tempFilePath = []
        tempFilePath.push(res.tempFilePath)
        var tempFilesSize = res.size;
        // if (tempFilesSize <= 25 * 1024 * 1024) {
        if (util.allowUploadFormat(tempFilePath)) {
          // util.uploadV(res.tempFilePath)
          util.uploadV(apiurl.upload_video, that, res, function (e) {

            if (e.status != 200) {
              return util.alert(e.message)
            }
            tempFile.src = e.result.video_url
            tempFile.upload_percent = 100
            wx.hideLoading()
            that.setData({
              video: tempFile
            })
            wx.setStorageSync('videoe', tempFile)
          }, function (e) {
            tempFile.upload_percent = e
            that.setData({
              video: tempFile
            })
            // // console.log(e)
          })
        } else {
          util.alert("视频上传异常!");
        }
        // }
      }
    })
  },
  deletevideo() {
    this.setData({
      video: []
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  show() {
    this.setData({
      show: true
    })
  },
  unshow() {
    this.setData({
      show: false
    })
  },
  showa() {
    this.setData({
      showa: true
    })
  },
  unshowa() {
    this.setData({
      showa: false
    })
  },
  inputa(e) {
    this.setData({
      business_address: e.detail.value
    })
    wx.setStorageSync('license_info[business_address]e', e.detail.value)
  },
  shows() {
    this.setData({
      shows: true
    })
  },
  unshows() {
    this.setData({
      shows: false
    })
  },
  inputs(e) {
    this.setData({
      business_scope: e.detail.value
    })
    wx.setStorageSync('license_info[business_scope]e', e.detail.value)
  },
  onOpen1() {
    // // console.log("sssss")
    this.setData({ visible1: true })
  },
  onClose1() {
    this.setData({ visible1: false })
  },
  onChange1(e) {
    this.setData({ title1: e.detail.options.map((n) => n.label).join('-'), cate_id: e.detail.options[e.detail.options.length - 1].id })
    // // console.log('onChange1', e.detail)
    // console.log(e.detail.options[e.detail.options.length - 1].id)
    wx.setStorageSync("cate_ide", e.detail.options[e.detail.options.length - 1].id)
    wx.setStorageSync("title1e", e.detail.options.map((n) => n.label).join('-'))
  },
  onLoad: function (options) {
    var that = this;
    var result = app.globalData.config
    var share_mobile = options.share_mobile ? options.share_mobile : ''
    that.setData({
      type: '',
      source: options.source||'',
      shop_settled: app.globalData.config.protocol.shop_settled,
      choosed: wx.getStorageSync('choosede') || that.data.choosed,
      share_mobile: share_mobile
    })
    // options.shop_id=30
    if (options.shop_id) {
      util.getJSON({ apiUrl: apiurl.shop_showOwn + options.shop_id }, function (res) {
        var result = res.data.result
        var image = [
          { title: '营业执照', upload_picture_list: [{ upload_percent: 100, path_server: '' }], text: "点击拍摄/上传图片", id: 0 },
          { title: '店招上传', upload_picture_list: [{ upload_percent: 100, path_server: '' }], text: "点击拍摄/上传图片", id: 1 },
        ], upload_picture_list = []

        image[0]["upload_picture_list"][0]['path_server'] = result.license || '';
        image[1]["upload_picture_list"][0]['path_server'] = ''
        for (var i in result.images) {
          upload_picture_list.push({ upload_percent: 100, 'path_server': result.images[i] })
        }
        var type_val = that.data.type_val, shop_cate = that.data.shop_cate, tshop_cate = that.data.tshop_cate
        var video = { upload_percent: 100, src: result.video }

        that.setData({
          shop_cate: shop_cate,
          shop_id: options.shop_id,
          result: result,
          title1: result.cate_name,
          address: result.address,
          area_id: result.area_id,
          area_id_val: result.area_id,
          areaSelectedStr: result.area_name,
          contact: result.contact,
          intro: result.intro,
          latitude: result.latitude,
          longitude: result.longitude,
          shop_id: result.shop_id,
          status: result.status,
          status_name: result.status_name,
          title: result.title,
          image: image,
          cate_id: result.cate_id,
          upload_picture_list: upload_picture_list || '',
          discount_percent: result.discount_percent || '',
          status_remark: result.status_remark || '',
          // company_name: result.license_info.company_name || '',
          // license_no: result.license_info.license_no || '',
          // legal_person: result.license_info.legal_person || '',
          // business_address: result.license_info.business_address || '',
          // business_scope: result.license_info.business_scope || '',
          video: video,
          source: result.source,
          share_mobile: result.share_mobile||'',
        })
        wx.hideLoading()
      })

    } else {
      var image = [
        { title: '营业执照', upload_picture_list: wx.getStorageSync("image0e") || '', text: "点击拍摄/上传图片", id: 0 },
        { title: '店招上传', upload_picture_list: wx.getStorageSync("image1e"), text: "点击拍摄/上传图片", id: 1 },
      ], upload_picture_list = wx.getStorageSync("upload_picture_liste") || []

      var type_val = that.data.type_val, shop_cate = that.data.shop_cate, tshop_cate = that.data.tshop_cate
      that.setData({
        contact: wx.getStorageSync("contacte"),
        title: wx.getStorageSync("titlee"),
        address: wx.getStorageSync("addresse"),
        intro: wx.getStorageSync("introe"),
        type_val: type_val,
        shop_cate: shop_cate,
        tshop_cate: tshop_cate,
        image: image,
        upload_picture_list: upload_picture_list,
        title1: wx.getStorageSync("title1e"),
        cate_id: wx.getStorageSync("cate_ide"),
        areaSelectedStr: wx.getStorageSync('areaSelectedStre'),
        area_id_val: wx.getStorageSync('area_ide'),
        discount_percent: wx.getStorageSync('discount_percente'),
        longitude: wx.getStorageSync('longitudee'),
        latitude: wx.getStorageSync('latitudee'),
        // company_name: wx.getStorageSync('license_info[company_name]e'),
        // license_no: wx.getStorageSync('license_info[license_no]e'),
        // legal_person: wx.getStorageSync('license_info[legal_person]e'),
        // business_address: wx.getStorageSync('license_info[business_address]e'),
        // business_scope: wx.getStorageSync('license_info[business_scope]e'),
        video: wx.getStorageSync('videoe'),
        share_mobile: wx.getStorageSync('share_mobilee') || that.data.share_mobile,
      })
    }
  },
  location(address) {
    var that = this
    if (that.data.choosead) {
      return that.setData({
        choosead: false
      })
    }
    qqMap.geocoder({
      address: address,
      complete: res => {
        // console.log(res);   //经纬度对象
        if (res.result&&res.result.status == 0 && res.result.location) {
          var longitude = that.data.location
          var latitude = that.data.location
          if (that.data.address.indexOf(res.result.title) != -1) {
            longitude = res.result.location.lng
            latitude = res.result.location.lat
          }
          that.setData({
            longitude: longitude,
            latitude: latitude,
          })
          // console.log(longitude, latitude)
          wx.setStorageSync('longitudee', longitude)
          wx.setStorageSync('latitudee', latitude)
        }

      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  input(e) {
    // // console.log(e)
    if (e.currentTarget.dataset.contact == "intro") {
      this.setData({
        intro: e.detail.value
      })
    }
    if (e.currentTarget.dataset.contact == "license_info[license_no]") {
      util.testwl(e.detail.value, '请输入正确的许可证号', function () {

      })
    }
    wx.setStorageSync(e.currentTarget.dataset.contact+"e", e.detail.value)
  },
  czaddress() {
    var that = this

    that.location(that.data.areaSelectedStr + " " + that.data.address)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  radioChange: function (e) {//入驻类型选择
    var that = this;


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
        util.loading()
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
      header: {
        "content-type": 'application/x-www-form-urlencoded',
        'token': util.getToken(),
        'channel': 'let',
        'build': util.build
      },
      //附近数据，这里为路径     
      success: function (res) {
        var data = JSON.parse(res.data);
        // //字符串转化为JSON  

        if (data.status == 200) {
          var filename = data.result.image_url //存储地址 显示
          upload_picture_list[j]['path_server'] = filename
          util.hideLoading()
        } else {
          upload_picture_list[j]['path_server'] = filename
        }

        that.setData({
          ['image[' + index + '].upload_picture_list']: upload_picture_list,
        });
        wx.setStorageSync('image' + index+'e', upload_picture_list)
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
    wx.setStorageSync('image' + e.currentTarget.dataset.index+'e', [])
    // 
  },
  // 查看图片
  previewImg(e) {
    util.previewImage(e.currentTarget.dataset.src)
  },
  uploadpic1: function (e) {
    var that = this //获取上下文
    var upload_picture_list = that.data.upload_picture_list
    // console.log(e)
    //选择图片
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        util.loading()
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

            // // console.log(tempFiles[i])
            // // console.log(upload_picture_list)
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
        util.upload_file_server(apiurl.upload_image, page, upload_picture_list, j, '', 3)
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
    wx.setStorageSync('upload_picture_liste', upload_picture_list)
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

  },
  choosearea(e) {
    // console.log(e)
    this.setData({
      areaSelectedStr: e.detail.areaSelectedStr,
      area_id_val: e.detail.area_id_val,
      konwname: e.detail.konwname
    })
    wx.setStorageSync('areaSelectedStre', e.detail.areaSelectedStr)
    wx.setStorageSync('area_ide', e.detail.area_id_val)
  },
  xiugai() {
    this.setData({
      disabled1: false
    })
  },
  choose() {
    this.setData({
      choosed: !this.data.choosed
    })
    wx.setStorageSync('choosede', this.data.choosed)
  },
  formSubmit(e) {
    var that = this;
    if (that.data.choosed != 1) {
      return util.alert('请勾选用户协议')
    }
    var data = e.detail.value;
    data.area_id = that.data.area_id_val
    // data.token = util.getToken()
    data.type = 2
    data.intro = that.data.intro
    data.cate_id = that.data.cate_id
    data["longitude"] = that.data.longitude
    data["latitude"] = that.data.latitude
    // console.log(data)
    var images = ["license", "thumb"]
    for (var a in that.data.image) {
      if (that.data.image[a].upload_picture_list != '') {
        data[images[a]] = that.data.image[a].upload_picture_list[0]['path_server']
      }
    }
    if (this.data.video.src && this.data.video.src.length > 0) {
      data.video = this.data.video.src
    }
    data['license_info[business_address]'] = this.data.business_address
    data['license_info[business_scope]'] = this.data.business_scope
    for (var a in that.data.upload_picture_list) {
      data['images[' + a + ']'] = that.data.upload_picture_list[a]['path_server']
    }
    data["source"] = that.data.source
    var url = apiurl.shop_apply;
    if (this.data.shop_id) {
      url = apiurl.shop_update;
      data["shop_id"] = that.data.shop_id
    }
    that.setData({
      post: true
    })
    that.setData({
      post: true
    })
    util.postJSON({ apiUrl: url, data: data }, function (res) {
      var result = res.data.result

      util.alert("申请提交成功，等待审核")
      var arr = ['contact', 'discount_percent', 'title', 'address', 'intro', 'area_id', 'type', 'cate_id', 'title1', 'areaSelectedStr', 'image0', 'image1', "upload_picture_list", 'choosed', 'latitude', "longitude", 'license_info[business_address]', 'license_info[business_scope]', 'license_info[company_name]', 'license_info[license_no]', 'license_info[legal_person]', 'video', 'share_mobile']
      for (var i in arr) {
        wx.setStorageSync(arr[i] + "e", '')
      }
      setTimeout(function () {
        wx.reLaunch({
          url: '../index/index',
          success() {
            that.setData({
              post: false
            })
          }
        })
      }, 0)

    }, function (res) {
      // console.log(res.data.message)
      that.setData({
        post: false
      })
    }, function (res) {

      that.setData({
        post: false
      })
    })
  },
  backfill: function (e) {
    // console.log(e)
    var id = e.currentTarget.id;
    for (var i = 0; i < this.data.suggestion.length; i++) {
      if (i == id) {
        // console.log(this.data.suggestion[i])
        wx.setStorageSync('addresse', this.data.suggestion[i].title)

        wx.setStorageSync('longitudee', this.data.suggestion[i].longitude)
        wx.setStorageSync('latitudee', this.data.suggestion[i].latitude)
        this.setData({
          longitude: this.data.suggestion[i].longitude,
          latitude: this.data.suggestion[i].latitude,
          address: this.data.suggestion[i].title,
          choosead: true,
          suggestion: []
        });

      }
    }
  },
  addresszzc() {
    this.setData({
      suggestion: []
    })
  },
  hiddensug() {
    this.setData({
      suggestion: [],
    })
  },
  //触发关键词输入提示事件
  getsuggest: function (e) {
    var _this = this;
    var city = _this.data.konwname || (_this.data.areaSelectedStr && _this.data.areaSelectedStr.split(" ")[1])
    if (e.detail.value == '') {
      return this.setData({
        suggestion: '',
        address: ''
      })
    }
    //调用关键词提示接口
    qqMap.getSuggestion({
      //获取输入框值并设置keyword参数
      keyword: e.detail.value, //用户输入的关键词，可设置固定值,如keyword:'KFC'
      region: city, //设置城市名，限制关键词所示的地域范围，非必填参数
      success: function (res) {//搜索成功后的回调
        // console.log(res);
        var sug = [];
        for (var i = 0; i < res.data.length; i++) {
          sug.push({ // 获取返回结果，放到sug数组中
            title: res.data[i].title,
            id: res.data[i].id,
            addr: res.data[i].address,
            city: res.data[i].city,
            district: res.data[i].district,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng
          });
        }
        _this.setData({ //设置suggestion属性，将关键词搜索结果以列表形式展示
          suggestion: sug,
          address: e.detail.value
        });
      },
      fail: function (error) {
        // console.error(error);
      },
      complete: function (res) {
        // console.log(res);
      }
    });
  }
})