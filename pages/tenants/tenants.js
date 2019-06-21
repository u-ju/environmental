// pages/tenants/tenants.js
var QQMapWX = require('../../utils//qqmap-wx-jssdk.min.js');

// 实例化API核心类
let qqMap = new QQMapWX({
  key: 'HPNBZ-B426V-CZQPP-UN4R6-QYOF2-MYFU3' // 必填
});
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');

const date = new Date()
const hour1 = []
const hour2 = []
var min = [':00',":30"]
for (var i = 0; i < 24; i++) {

  for(var a in min){
    hour1.push(i + min[a])
    hour2.push(i + min[a])
  }
  
}
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
      // { title: '营业执照', upload_picture_list: [], text: "点击拍摄/上传图片", id: 0 },
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
    choosead: true,


    room_list:[],
    hour1: [],
    hour2: [],
    timevalue: [],
    timevalueR:[],
    visiblet:false,
    features:[],
    featuresv: '',
    room: [],
    roomv: '',
    items: [
      { name: 1, value: '同意', checked: true },
    ],
    choose: ['1'],
    video:{src:''},
    clicktime:'0:00-0:00',
    showa:false,
    shows: false,
    timezc: 0
  },
  checkboxChange(e) {
    this.setData({
      choose: e.detail.value
    })
  },
  bindChange: function (e) {
    const val = e.detail.value
    var timevalue = this.data.timevalue
    var time = this.data.hour1[val[0]] + '-' + this.data.hour1[val[1]];
    var timenum = timevalue.length-1
    console.log(this.data.timezc)
    this.setData({
      timevalue: timevalue,
      clicktime: time
    })
  },
  testcall(e) {
    util.testjq(e.detail.value, "请输入正确的联系方式", function () {

    })
  },
  opent(){
    this.setData({
      visiblet:true,
      timezc: 0,
      timevalue: util.copyarr(this.data.timevalueR),
      clicktime: this.data.clicktime,
    })
  },
  colset(){
    this.setData({
      visiblet: false,
      timecz:0
    })
  },
  deltime(e){
    let index = e.currentTarget.dataset.index;
    let timevalue = this.data.timevalue;
    timevalue.splice(index, 1);
    this.setData({
      timevalue: timevalue,

    })
  },
  ch_del(){
    this.setData({
      visiblet:false,
      timecz: 0
    })
  },
  ch_true(){
    
    this.setData({
      visiblet: false,
      timevalueR: util.copyarr(this.data.timevalue),
      timecz:0
    })
    wx.setStorageSync('timevaluet', this.data.timevalue)
  },
  timeadd(e){
    var timevalue = this.data.timevalue||[];

    timevalue.push(this.data.clicktime)
    this.setData({
      timevalue: timevalue,
      timezc:1
    })
  },
  features(e){
    var features = this.data.features||[];
    if (features.indexOf(e.detail.value)>-1){
      return
    }
    features.push(e.detail.value)
    this.setData({
      features: features,
      featuresv:''
    })
    wx.setStorageSync('featurest', features)
  },
  delfeature(e){
    let index = e.currentTarget.dataset.index;
    let features = this.data.features;
    features.splice(index, 1);
    this.setData({
      features: features
    })
    wx.setStorageSync('featurest', features)
  },
  roomcz(e){
    var item = e.currentTarget.dataset.item
    var room = this.data.room
    for (var i in room){
      if (room[i] == null || room[i] == undefined){
        room.splice(i, 1);
      }
    }
    if (room.indexOf(item)>-1){
      room.splice(room.indexOf(item), 1);
    }else{
      room.push(e.currentTarget.dataset.item)
    }
    this.setData({
      room: room,
    })
    wx.setStorageSync('roomt', room)
  },
  uploadvideo(e){
    var that = this;
    
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      success: function (res) {
        util.loading()
        var promiseArr = []
        var tempFile = {}
        tempFile.img = res.thumbTempFilePath;
        tempFile.upload_percent = 0

        var tempFilePath=[]
        tempFilePath.push(res.tempFilePath)
        var tempFilesSize = res.size;
        // if (tempFilesSize <= 25 * 1024 * 1024) {
          if (util.allowUploadFormat(tempFilePath)){
            // util.uploadV(res.tempFilePath)
            util.uploadV(apiurl.upload_video, that, res,function(e){
              
              if(e.status!=200){
                return util.alert(e.message)
              }
              tempFile.src = e.result.video_url
              tempFile.upload_percent=100
              wx.hideLoading()
              that.setData({
                video: tempFile 
              })
              wx.setStorageSync('videot', tempFile)
            },function(e){
              tempFile.upload_percent = e
              that.setData({
                video: tempFile
              })
            })
          } else {
            util.alert("视频上传异常!");
          }
        // }
      }
    })
  },
  deletevideo(){
    this.setData({
      video:[]
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
  inputa(e){
    this.setData({
      business_address: e.detail.value
    })
    wx.setStorageSync('license_info[business_address]t', e.detail.value)
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
    wx.setStorageSync('license_info[business_scope]t', e.detail.value)
  },
  onOpen1() {
    this.setData({ visible1: true })
  },
  onClose1() {
    this.setData({ visible1: false })
  },
  onChange1(e) {
    this.setData({ title1: e.detail.options.map((n) => n.label).join('-'), cate_id: e.detail.options[e.detail.options.length - 1].id })
 
    wx.setStorageSync("cate_idt", e.detail.options[e.detail.options.length - 1].id)
    wx.setStorageSync("title1t", e.detail.options.map((n) => n.label).join('-'))
  },
  onLoad: function (options) {

    var that = this;

    var share_mobile = options.apply_info ? JSON.parse(options.apply_info).share_mobile : ''
    this.setData({
      hour1: hour1,
      hour2: hour2,
      source: options.source || '',
      // room_list: JSON.parse(options.room_list)
      features: JSON.parse(options.apply_info).feature_list,
      share_mobile: share_mobile
    })
    var result = app.globalData.config
    var shop_cate = result.shop_cate
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
      type: '',
      shop_settled: app.globalData.config.protocol.shop_settled,
      choosed: wx.getStorageSync('choosedt') || that.data.choosed,
      features: JSON.parse(options.apply_info).feature_list
    })
    if (options.shop_id) {
      util.getJSON({ apiUrl: apiurl.shop_showOwn + options.shop_id }, function (res) {
        var result = res.data.result
        var image = [
          { title: '营业执照', upload_picture_list: [{ upload_percent: 100, path_server: '' }], text: "点击拍摄/上传图片", id: 0 },
          { title: '店招上传', upload_picture_list: [{ upload_percent: 100, path_server: '' }], text: "点击拍摄/上传图片", id: 1 },
        ]
        var  upload_picture_list = []

        image[0]["upload_picture_list"][0]['path_server'] = result.license||'';
        image[1]["upload_picture_list"][0]['path_server'] = result.thumb
        for (var i in result.images) {
          upload_picture_list.push({ upload_percent: 100, 'path_server': result.images[i] })
        }
        var type_val = that.data.type_val, shop_cate = that.data.shop_cate, tshop_cate = that.data.tshop_cate
        var video={ upload_percent: 100, src: result.video}
        var timevalue = []
        for(var a=0; a< result.business_time.length;a++){
        	timevalue.push(result.business_time[a].start+'-'+result.business_time[a].end)
        }
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
          upload_picture_list: upload_picture_list,
          discount_percent: result.discount_percent,
          status_remark: result.status_remark,
          
          timevalue: timevalue,
	        timevalueR: timevalue,
	        // room: result.reservation.room,
	        video: video,
	        features: result.feature,
	        cost: result.cost,
	        // min_person: result.reservation.min_person,
	        // max_person: result.reservation.max_person,
	        // company_name: result.license_info.company_name||'',
          // license_no: result.license_info.license_no || '',
          // legal_person: result.license_info.legal_person || '',
          // business_address: result.license_info.business_address || '',
          // business_scope: result.license_info.business_scope || '',
          source: result.source,
          share_mobile: result.share_mobile || '',
        })
        wx.hideLoading()
      })

    } else {
      var image = [
        { title: '营业执照', upload_picture_list: wx.getStorageSync("image0t") || '', text: "点击拍摄/上传图片", id: 0 },
        { title: '店招上传', upload_picture_list: wx.getStorageSync("image1t"), text: "点击拍摄/上传图片", id: 1 },
      ], upload_picture_list = wx.getStorageSync("upload_picture_listt") || []
      var type_val = that.data.type_val, shop_cate = that.data.shop_cate, tshop_cate = that.data.tshop_cate
      
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
        cate_id: wx.getStorageSync("cate_idt"),
        areaSelectedStr: wx.getStorageSync('areaSelectedStrt'),
        area_id_val: wx.getStorageSync('area_idt'),
        discount_percent: wx.getStorageSync('discount_percentt'),
        longitude: wx.getStorageSync('longitudet'),
        latitude: wx.getStorageSync('latitudet'),
        
        timevalue: wx.getStorageSync('timevaluet')||[],
        timevalueR: wx.getStorageSync('timevaluet'),
        room: wx.getStorageSync('roomt'),
        video: wx.getStorageSync('videot'),
        features: wx.getStorageSync('featurest') || that.data.features,
        cost: wx.getStorageSync('costt'),
        // min_person: wx.getStorageSync('reservation[min_person]t'),
        // max_person: wx.getStorageSync('reservation[max_person]t'),
        // company_name: wx.getStorageSync('license_info[company_name]t')||'',
        // license_no: wx.getStorageSync('license_info[license_no]t') || '',
        // legal_person: wx.getStorageSync('license_info[legal_person]t') || '',
        // business_address: wx.getStorageSync('license_info[business_address]t') || '',
        // business_scope: wx.getStorageSync('license_info[business_scope]t') || '',
        share_mobile: wx.getStorageSync('share_mobilet') || that.data.share_mobile,
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
  //经纬度对象
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
          wx.setStorageSync('longitudet', longitude)
          wx.setStorageSync('latitudet', latitude)
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
    if (e.currentTarget.dataset.contact == "introt") {
      this.setData({
        intro: e.detail.value
      })
    }
    if (e.currentTarget.dataset.contact == "license_info[license_no]t") {
      util.testwl(e.detail.value, '请输入正确的许可证号', function () {
        
      })
    }
    // if (e.currentTarget.dataset.contact == "addresst") {
    //   this.setData({
    //     address: e.detail.value
    //   })
    // }
    wx.setStorageSync(e.currentTarget.dataset.contact, e.detail.value)
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
        wx.setStorageSync('image' + index+'t', upload_picture_list)
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
  // 查看图片
  previewImg(e){
    util.previewImage(e.currentTarget.dataset.src)
  },
  // 删除图片
  deleteImg: function (e) {

    var that = this;
    
    that.setData({
      ['image[' + e.currentTarget.dataset.index + '].upload_picture_list']: [],
    });
    wx.setStorageSync('image' + e.currentTarget.dataset.index + 't', [])
    // 
  },
  uploadpic1: function (e) {
    var that = this //获取上下文
    var upload_picture_list = that.data.upload_picture_list
 
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
    wx.setStorageSync('upload_picture_listt', upload_picture_list)

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
    this.setData({
      areaSelectedStr: e.detail.areaSelectedStr,
      area_id_val: e.detail.area_id_val,
      konwname: e.detail.konwname
    })
    wx.setStorageSync('areaSelectedStrt', e.detail.areaSelectedStr)
    wx.setStorageSync('area_idt', e.detail.area_id_val)
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
    wx.setStorageSync('choosedt', this.data.choosed)
  },
  formSubmit(e) {
    var that = this;
    if (that.data.choosed != 1) {
      return util.alert('请勾选用户协议')
    }
    var data = e.detail.value;
    if (this.data.video.src&&this.data.video.src.length>0){
      data.video = this.data.video.src
    }
    for (var c in this.data.timevalueR){
      data['business_time[' + c + '][start]'] = this.data.timevalueR[c].split("-")[0]
      data['business_time[' + c + '][end]'] = this.data.timevalueR[c].split("-")[1]
    }
    for (var d in this.data.features){
      data['feature['+d+']'] = this.data.features[d]
    }
    // for (var e in this.data.room) {
    //   data['reservation[room]['+e+']'] = this.data.room[e]
    // }
    data['license_info[business_address]'] = this.data.business_address
    data['license_info[business_scope]'] = this.data.business_scope
    data.area_id = that.data.area_id_val
    data.type = 2
    data.intro = that.data.intro
    data.cate_id = 40
    // that.data.cate_id
    data["longitude"] = that.data.longitude
    data["latitude"] = that.data.latitude

    var images = ["license", "thumb"]
    for (var a in that.data.image) {
      if (that.data.image[a].upload_picture_list != '') {
        data[images[a]] = that.data.image[a].upload_picture_list[0]['path_server']
      }
    }
    for (var b in that.data.upload_picture_list) {
      data['images[' + b + ']'] = that.data.upload_picture_list[b]['path_server']
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
 util.postJSON({ apiUrl: url, data: data }, function (res) {
   var result = res.data.result

      util.alert("申请提交成功，等待审核")
   var arr = ['contact', 'discount_percent', 'title', 'address', 'intro', 'area_id', 'type', 'cate_id', 'title1', 'areaSelectedStr', 'image0', 'image1', "upload_picture_list", 'choosed', 'latitude', "longitude", 'license_info[business_address]', 'license_info[business_scope]', 'license_info[company_name]', 'license_info[license_no]', 'license_info[legal_person]', 'video', 'cost', 'features', 'room', 'timevalue','share_mobile']
   		for(var i in arr){
          wx.setStorageSync(arr[i]+"t", '')
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

    var id = e.currentTarget.id;
    for (var i = 0; i < this.data.suggestion.length; i++) {
      if (i == id) {
        wx.setStorageSync('addresst', this.data.suggestion[i].title)

        wx.setStorageSync('longitudet', this.data.suggestion[i].longitude)
        wx.setStorageSync('latitudet', this.data.suggestion[i].latitude)
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
  addresszzc(){
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
     
      },
      complete: function (res) {
      
      }
    });
  }
})