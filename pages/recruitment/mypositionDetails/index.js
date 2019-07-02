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
    visiblet: false,
    visibler: false,
    visiblee: false,
    item: ['初中及以下', '高中','大专'],
    salary:'',
    salaryid:'',
    valuet:[],
    object: { label: 'name', value: 'id', children: 'children' },
    id:-1,
    experienceid:'',
    educationid:'',
    salaryt:'',
    education:'',
    educationid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 
    this.conf()
    if(options.id){
      this.init(1)
    }
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
      salaryt: this.data.salary || this.data.salaryt,
      salaryidt: this.data.salaryid || this.data.salaryid,
      value: this.data.valuet,
    })
  },
  colse(e){
    this.setData({
      ['visible' + e.target.dataset.name]: false
    })
  },
  // 薪资
  ch_del() {
    this.setData({
      visiblet: false
    })
  },
  ch_true() {
    this.setData({
      visiblet: false,
      salary: this.data.salaryt||'',
      salaryid: this.data.salaryidt || '',
      valuet: this.data.value || '',
      // educationid: this.data.educationidt || '',
      // experienceid: this.data.experienceidt || '',
    })
    console.log(this.data.salaryt)
  },
  bindChange(e) {
    console.log(e.detail.value)
    var arr = util.copyarr(this.data.salaryi), arr2 = this.data.salary2

    if (this.data.start != e.detail.value[0]) {
      arr2 = util.copyarr(this.data.salaryi).slice(e.detail.value[0] + 1, arr.length)
      if (e.detail.value[0] == 0) {
        arr2 = [arr[0]]
      }
    }
    this.setData({
      salary2: arr2,
      salaryt: this.data.salaryi[e.detail.value[0]]['name'] + "," + arr2[e.detail.value[1]]['name'],
      salaryidt: this.data.salaryi[e.detail.value[0]]['id'] + "," + arr2[e.detail.value[1]]['id'],
      value: e.detail.value,

    })
  },
  // 学历
  delRecord() {
    this.setData({
      visibler: false
    })
  },
  trueRecord() {
    this.setData({
      visibler: false,
      education: this.data.educationt,
      educationid: this.data.educationidt
    })
  },
  education(e){
    console.log(e.currentTarget.dataset)
    this.setData({
      educationt: e.currentTarget.dataset.name,
      educationidt: e.currentTarget.dataset.id
    })
  },
  // 经验
  delexperience() {
    this.setData({
      visiblee: false
    })
  },
  trueexperience() {
    this.setData({
      visiblee: false,
      experience: this.data.experiencet,
      experienceid: this.data.experienceidt
    })
  },
  experience(e) {
    console.log(e.currentTarget.dataset)
    this.setData({
      experiencet: e.currentTarget.dataset.name,
      experienceidt: e.currentTarget.dataset.id
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
      content: e.detail.value
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
      apiUrl: apiurl.recruit.conf ,
    }, function (res) {
      var post = res.data.result.post
      var salary1 = util.copyarr(post.salary), salary2 = util.copyarr(post.salary)
      salary1.length = salary1.length-1
      salary2 = [salary2[0]]
      console.log(salary1)
      that.setData({
        conf: post,
        salaryi: post.salary,
        educationi: post.education,
        experiencei: post.experience,
        salary_filteri: post.salary_filter,
        salary1: salary1,
        salary2: salary2,
        cate: post.cate,
        salaryt: salary1[0]['name'],
        salaryidt: salary1[0]['id'] + "," + salary1[0]['id'],
      })
      util.hideLoading()
    })
  },
  init(id){
    var that = this;
    util.getJSON({
      apiUrl: apiurl.recruit.personPostShow+id ,
    }, function (res) {
      var result = res.data.result
      that.setData({
        address: result.address,
        area_id: result.area_id,
        areaSelectedStr: result.area_name,
        cate_id: result.cate_id,
        cate_name: result.cate_name,
        content: result.content,
        education: result.education_name,
        educationid: result.education,
        experience: result.experience_name,
        experienceid: result.experience,
        name: result.name,
        salary: result.salary_name,
        salaryid: result.salary_front + ',' + result.salary_end,
        id: id
      })
      util.hideLoading()
    })
  },
  submit(e) {
    console.log(e)
    var data = e.detail.value, that = this
    data.cate_id = this.data.cate_id
    data.salary = this.data.salaryid
    data.experience = this.data.experienceid
    data.education = this.data.educationid
    data.area_id = this.data.area_id
    data.longitude = this.data.longitude
    data.latitude = this.data.latitude
    data.content = this.data.content
    this.setData({
      post: true
    })
    console.log(data)
    var url = "personPostStore"
    if(this.data.id!=-1){
      url = "personPostUpdate"
    }
    util.postJSON({
      apiUrl: apiurl.recruit[url],
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