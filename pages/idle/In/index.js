// pages/recruitment/recruit/mypositionDetails/index.js
const app = getApp()
var util = require('../../../utils/util.js');
var apiurl = require('../../../utils/api.js');
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
let qqMap = new QQMapWX({
  key: 'HPNBZ-B426V-CZQPP-UN4R6-QYOF2-MYFU3' // 必填
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visiblee: false,
    cate_tag:[],
    cate_tagf: [],
    cate_tag_namef:[],
    cate_tag_name: [],
    cate_tagi: [],
    show:false,
    image:[
      { title: '展示图', upload_picture_list: [], text: "点击拍摄/上传图片", id: 0 },
      { title: '执照/证书', upload_picture_list: [], text: "点击拍摄/上传图片", id: 1 },
    ],
    is_law:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 
    this.conf()
    this.init()
  },
  onChange1(e) {
    console.log(e)
    this.setData({ 
      cate_name: e.detail.options.map((n) => n.name).join('-'), 
      cate_id: e.detail.options[e.detail.options.length - 1].id 
    })
  },
  open(e) {
    this.setData({
      ['visible' + e.target.dataset.name]: true,
    })
  },
  colse(e){
    this.setData({
      ['visible' + e.target.dataset.name]: false
    })
  },
  
  // 经验
  delcate() {
    this.setData({
      visiblee: false,
      cate_tag_namef: this.data.cate_tag_name,
      cate_tagf: this.data.cate_tag
    })
  },
  truecate() {
    this.setData({
      visiblee: false,
      cate_tag_name: this.data.cate_tag_namef,
      cate_tag: this.data.cate_tagf
    })
  },
  cate(e) {
    var cate_tag = this.data.cate_tagf, cate_tag_name = this.data.cate_tag_namef
    if (cate_tag.indexOf(e.currentTarget.dataset.id)==-1){
      cate_tag.push(e.currentTarget.dataset.id)
      cate_tag_name.push(e.currentTarget.dataset.name)
    }else{
      cate_tag.splice(cate_tag.indexOf(e.currentTarget.dataset.id), 1)
      cate_tag_name.splice(cate_tag.indexOf(e.currentTarget.dataset.id), 1)
    }
    console.log(cate_tag)
    this.setData({
      cate_tagf: cate_tag,
      cate_tag_namef: cate_tag_name,
    })
  },
  init() {
    var that = this;
    util.getJSON({
      apiUrl: apiurl.law.infoHome,
    }, function (res) {
      var result = res.data.result
      var image = [
        { title: '展示图', upload_picture_list: [{ upload_percent: 100, path_server: result.law.license || "" }], text: "点击拍摄/上传图片", id: 0 },
        { title: '执照/证书', upload_picture_list: [{ upload_percent: 100, path_server: result.law.thumb || "" }], text: "点击拍摄/上传图片", id: 1 },
      ]
      if (result.is_law==0){
        image=that.data.image
      }

      that.setData({
        is_law: result.is_law,
        image: image,
        name: result.law.name || "",
        intro: result.law.intro || "",
        price: result.law.price || "",
        contact: result.law.contact || "",
        area_id: result.law.area_id || "",
        address: result.law.address || "",
        areaSelectedStr: result.law.area_name || "",
        status_remark: result.law.status_remark || "",
      })
      wx.hideLoading()
    })
  },
  // 文本
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
  input(e){
    this.setData({
      intro: e.detail.value
    })
  },
  // 区域
  choosearea(e) {
    // console.log(e)
    this.setData({
      areaSelectedStr: e.detail.areaSelectedStr,
      area_id: e.detail.area_id_val,
      konwname: e.detail.konwname
    })
  },
  uploadpic(e) {
    var that = this;
    var index = e.currentTarget.dataset.indexnum;

    util.uploadpic(that, 1, 'upload_picture_list', '', function (images) {
      console.log(images)
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
  uploadpic1(e) {
    var that = this;
    var index = e.currentTarget.dataset.indexnum;

    util.uploadpic(that, 9, 'lunbo', '', function (images) {
      console.log(images)
      that.setData({
        lunbo: images,
      });
      for (var j in images) {
        if (images[j]['upload_percent'] == 0) {
          //调用函数
          util.upload_pic(apiurl.upload_image, that, images, j, function (e) {
            that.setData({
              lunbo: e,
            });
            util.hideLoading()
          }, function (e) {
            that.setData({
              lunbo: e,
            });
          })
        }
      }
    })
  },
  deleteImg(e) {
    this.setData({
      upload_picture_list: [],
    });
  },
  deleteImg1(e){
    let upload_picture_list = this.data.lunbo;
    let index = e.currentTarget.dataset.index;
    upload_picture_list.splice(index, 1);
    this.setData({
      lunbo: upload_picture_list
    });
  },
  // 定位
  czaddress() {
    var that = this
    that.location(that.data.areaSelectedStr + " " + that.data.address)
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
        console.log(res);   //经纬度对象
        if (res.result && res.result.status == 0 && res.result.location) {
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
        }

      }
    })
  },
  backfill: function (e) {
    // console.log(e)
    var id = e.currentTarget.id;
    for (var i = 0; i < this.data.suggestion.length; i++) {
      if (i == id) {
        console.log(this.data.suggestion[i])
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
  },
  conf(){
    var that = this;
    util.getJSON({
      apiUrl: apiurl.law.conf ,
    }, function (res) {
      var cate_tag = res.data.result.cate_tag
      that.setData({
        cate_tagi: cate_tag
      })
      util.hideLoading()
    })
  },
  
  submit(e) {
    console.log(e)
    var data = e.detail.value, that = this,lunbo = this.data.lunbo
    data.thumb = this.data.upload_picture_list[0]['path_server'] || ""
    for (var a in lunbo){
      data["images[" + a + "]"] = lunbo[a]['path_server']
    }
    data.area_id=this.data.area_id
    data.intro = this.data.intro  
    for (var i in cate_tag){
      data["cate_tag[" + i + "]"] = cate_tag[i]
    }
    this.setData({
      post: true
    })
    console.log(data)
    var url = "infoStore"
    if (this.data.is_law!=0){
      url = "infoUpdate"
    }
    util.postJSON({
      apiUrl: apiurl.law[url],
      data: data
    }, function (res) {
      that.setData({
        post: false
      })
      wx.navigateBack()
      wx.hideLoading()
    }, function (res) {
      that.setData({
        post: false
      })
      wx.hideLoading()
    }, function (res) {
      that.setData({
        post: false
      })
      wx.hideLoading()
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