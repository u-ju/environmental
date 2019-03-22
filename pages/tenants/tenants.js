// pages/tenants/tenants.js
var QQMapWX = require('../../utils//qqmap-wx-jssdk.min.js');
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    post:false,
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
    tshop_cate:[],
    shop_cate:[],
    type:'',
    image:[
      { title: '店招上传', upload_picture_list: [], text: "点击拍摄/上传图片", id: 0 },
      { title: '营业执照', upload_picture_list: [], text: "点击拍摄/上传图片", id: 1},
    ],
    upload_picture_list:[],
    cate_id: '',
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
    area_id_val: 0,
    maskVisual: 'hidden',
    provinceName: '请选择',
    result:[],
    disabled1: false,
    shop_id:'',
    latitude:'',
    longitude:'',
    contact:'',
    title:'',
    address: '',
    intro: '',
    show:false,
    choosed:0,
    shop_protocol:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  show(){
    this.setData({
      show: true
    })
  },
  unshow(){
    this.setData({
      show: false
    })
  },
  onOpen1() {
    // console.log("sssss")
    this.setData({ visible1: true })
  },
  onClose1() {
    this.setData({ visible1: false })
  },
  onChange1(e) {
    this.setData({ title1: e.detail.options.map((n) => n.label).join('-'), cate_id: e.detail.options[e.detail.options.length - 1].id })
    // console.log('onChange1', e.detail)
    console.log(e.detail.options[e.detail.options.length - 1].id)
    wx.setStorageSync("cate_idt", e.detail.options[e.detail.options.length-1].id)
    wx.setStorageSync("title1t", e.detail.options.map((n) => n.label).join('-'))
  },
  onLoad: function (options) {
  
    var that = this;
    
    // util.getJSON({ apiUrl: apiurl.config }, function (res) {
    var result = app.globalData.config
    
    var arr = ["shop_cate", 'tshop_cate','shop_type']
    for(var a in arr){
      for (var i in result[arr[a]]){
        // console.log(result[arr[a]])
        result[arr[a]][i]["tchecked"]=false
      }
    }
    var shop_cate = result.shop_cate, tshop_cate = result.tshop_cate
      for (var i in shop_cate) {
        shop_cate[i]["value"] = shop_cate[i]["id"]
        shop_cate[i]["label"] = shop_cate[i]["name"]
        if (shop_cate[i]["children"] && shop_cate[i]["children"].length > 0) {
          for (var a in shop_cate[i].children) {
            shop_cate[i]["children"][a]["value"] = shop_cate[i]["children"][a]["id"]
            shop_cate[i]["children"][a]["label"] = shop_cate[i]["children"][a]["name"]
          }
        }
      }
      that.setData({
        shop_cate: shop_cate,
        tshop_cate: result.tshop_cate,
        type_val: result.shop_type,
        type: '', 
        shop_protocol: app.globalData.config.shop_protocol,
        choosed: wx.getStorageSync('choosedt')
      })
    this.loadAddress();
    if (options.shop_id){
      
      util.getJSON({ apiUrl: apiurl.shopSettled_show + "?shop_id=" + options.shop_id}, function (res) {
        var result = res.data.result
        var image = [
          { title: '店招上传', upload_picture_list: [{ upload_percent: 100, path_server:''}], text: "点击拍摄/上传图片", id: 0 },
          { title: '营业执照', upload_picture_list: [{ upload_percent: 100, path_server: '' }], text: "点击拍摄/上传图片", id: 1},
        ], upload_picture_list=[]
        image[0]["upload_picture_list"][0]['path_server'] = result.thumb
        image[1]["upload_picture_list"][0]['path_server'] = result.license;
        for (var i in result.images){
          
          upload_picture_list.push({ upload_percent: 100, 'path_server': result.images[i] })
        }
        var type_val = that.data.type_val, shop_cate = that.data.shop_cate, tshop_cate = that.data.tshop_cate

        // for (var a in type_val){
        //   type_val[a]["tchecked"]=false
        //   if (type_val[a].id == result.type){
        //     type_val[a]["tchecked"] = true
        //   }
        // }
        // that.setData({
        //   type_val: type_val,
        // })
        // if (result.type==1){
        //   for (var a in tshop_cate) {
        //     tshop_cate[a]["tchecked"] = false
        //     if (tshop_cate[a].id == result.cate_id) {
        //       tshop_cate[a]["tchecked"] = true
        //     }
        //   }
        // }
        // if (result.type == 2) {
        //   for (var a in shop_cate) {
        //     shop_cate[a]["tchecked"] = false
        //     if (shop_cate[a].id == result.cate_id) {
        //       shop_cate[a]["tchecked"] = true
        //     }
        //   }
        // }
        
        that.setData({
          tshop_cate: tshop_cate,
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
          // type: result.type,
          type_name: result.type_name,
          image: image,
          cate_id: result.cate_id,
          upload_picture_list: upload_picture_list,
          signed_rate: result.signed_rate,
        })
        wx.hideLoading()
      })

    }else{
      var image = [
        { title: '店招上传', upload_picture_list: wx.getStorageSync("image0"), text: "点击拍摄/上传图片", id: 0 },
        { title: '营业执照', upload_picture_list: wx.getStorageSync("image1"), text: "点击拍摄/上传图片", id: 1 },
      ], upload_picture_list = wx.getStorageSync("upload_picture_list")||[]
      
      var type_val = that.data.type_val, shop_cate = that.data.shop_cate, tshop_cate = that.data.tshop_cate
      // for (var a in type_val) {
      //   type_val[a]["tchecked"] = false
      //   if (type_val[a].id == wx.getStorageSync("typet")) {
      //     type_val[a]["tchecked"] = true
      //   }
      // }
      // if (wx.getStorageSync("typet")  == 1) {
      //   for (var a in tshop_cate) {
      //     tshop_cate[a]["tchecked"] = false
      //     if (tshop_cate[a].id == wx.getStorageSync("cate_idt")) {
      //       tshop_cate[a]["tchecked"] = true
      //     }
      //   }
      // }
      // if (wx.getStorageSync("typet") == 2) {
      //   for (var a in shop_cate) {
      //     shop_cate[a]["tchecked"] = false
      //     if (shop_cate[a].id == wx.getStorageSync("cate_idt")) {
      //       shop_cate[a]["tchecked"] = true
      //     }
      //   }
      // }
      that.setData({
        contact: wx.getStorageSync("contactt"),
        title: wx.getStorageSync("titlet"),
        address: wx.getStorageSync("addresst"),
        intro: wx.getStorageSync("introt"),
        type_val: type_val,
        shop_cate: shop_cate,
        tshop_cate: tshop_cate,
        image: image,
        upload_picture_list: upload_picture_list,
        title1: wx.getStorageSync("title1t"),
        cate_id:wx.getStorageSync("cate_idt"),
        areaSelectedStr: wx.getStorageSync('areaSelectedStrt'),
        area_id_val: wx.getStorageSync('area_idt'),
        signed_rate: wx.getStorageSync('signed_ratet'),
      })
      
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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  input(e){
    // console.log(e)
    if (e.currentTarget.dataset.contact == "introt"){
      this.setData({
        intro: e.detail.value
      })
    }
    wx.setStorageSync(e.currentTarget.dataset.contact, e.detail.value)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  radioChange: function (e) {//入驻类型选择
  var that =this;
    // if (e.currentTarget.dataset.type=="type"){
    //   that.setData({
    //     type: e.detail.value
    //   })
    //   wx.setStorageSync('typet', e.detail.value)
    // }else{
    //   that.setData({
    //     cate_id: e.detail.value
    //   })
    //   wx.setStorageSync('cate_idt', e.detail.value)
    // }
    
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
    // console.log(that.data)
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
            
            // console.log(tempFiles[i])
            // console.log(upload_picture_list)
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
        util.upload_file_server(apiurl.upload_image, page, upload_picture_list, j,'',1)
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
    // console.log(upload_picture_list)
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
          area_id_val: that.data.cityObjects[index]["area_id"]
        });
        wx.setStorageSync('areaSelectedStrt', areaSelectedStr)
        wx.setStorageSync('area_idt', that.data.cityObjects[index]["area_id"])
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
          area_id_val: that.data.regionObjects[index]["area_id"]
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
      area_id_val: that.data.townObjects[index]["area_id"]
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
  xiugai(){
    this.setData({
      disabled1:false
    })
  },
  choose() {
    this.setData({
      choosed: !this.data.choosed
    })
    wx.setStorageSync('choosedt', this.data.choosed)
  },
  formSubmit(e) {
    var that =this;
    if (that.data.choosed != 1) {
      return util.alert('请勾选用户协议')
    }
    // if(that.data.type==''){
    //   util.alert('请选择入驻类型')
    //   return false
    // }
    // if (that.data.cate_id == '') {
    //   util.alert('请选择商城类型')
    //   return false
    // }
    // var rule = {
    //   title: "请输入商店名称",
    //   contact: "请输入电话",
    //   area_id: "请选择地址",
    //   address: "请输入详细地址",
    //   intro: "请添加物品描述",
    // }
    // for (var i in rule) {
    //   if (e.detail.value[i] == "") {
    //     util.alert(rule[i])
    //     return false
    //   }
    // }
    var data = e.detail.value;
    data.area_id = that.data.area_id_val
    // data.token = util.getToken()
    data.type = 2
    data.intro = that.data.intro
    data.cate_id = that.data.cate_id
    data["longitude"] = that.data.longitude
    data["latitude"] = that.data.latitude
    console.log(data)
    var images = ["thumb", "license"]
    for(var a in that.data.image){
      if (that.data.image[a].upload_picture_list != ''){
        data[images[a]] = that.data.image[a].upload_picture_list[0]['path_server']
      }
    }
    for (var a in that.data.upload_picture_list) {
      data['images[' + a +']'] = that.data.upload_picture_list[a]['path_server']
    }
    var url = apiurl.shopSettled_apply;
    if (this.data.shop_id){
      url = apiurl.shopSettled_update;
      data["shop_id"] = that.data.shop_id
    }
    that.setData({
      post:true
    })
    util.postJSON({ apiUrl: url, data: data }, function (res) {
      var result = res.data.result
      
      util.alert("申请提交成功，等待审核")
      wx.setStorageSync("contactt",'')
      wx.setStorageSync("signed_ratet", '')
      wx.setStorageSync("titlet", '')
      wx.setStorageSync("addresst", '')
      wx.setStorageSync("introt", '')
      wx.setStorageSync("area_idt", '')
      wx.setStorageSync("typet", '')
      wx.setStorageSync("cate_idt", '')
      wx.setStorageSync("title1t", '')
      wx.setStorageSync("areaSelectedStrt", '')
      wx.setStorageSync("image0", '')
      wx.setStorageSync("image1", '')
      wx.setStorageSync("upload_picture_list", [])
      wx.setStorageSync('choosedt', '')
      wx.navigateTo({
        url: '../tenantsIndex/index',
      })
      that.setData({
        post: false
      })
    }, function (res) {
      console.log(res.data.message)
      if (res.data.message == "更新成功") {
        wx.navigateTo({
          url: '../tenantsIndex/index',
        })
      }
      that.setData({
        post: false
      })
      }, function (res) {
        
        that.setData({
          post: false
        })
      })
  }
})