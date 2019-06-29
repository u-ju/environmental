// pages/recruitment/recruit/interview/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */                                       
  data: {
    tabTxt: ['最新', '成都 ', '行业', '要求'],
    list:[],
    tabIndex:3,
    qyopen: true,
    isfull: true,
    cateid:[],
    cate:[],
    experience:'',
    education:'',
    salary:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      address: wx.getStorageSync('locAddresscity') || wx.getStorageSync('locAddress')
    })
    this.areaparse()
    this.init()
    this.conf()
  },
  conf() {
    var that = this;
    util.getJSON({
      apiUrl: apiurl.recruit.conf,
    }, function (res) {
      var post = res.data.result.post
      var salary1 = util.copyarr(post.salary), salary2 = util.copyarr(post.salary)
      salary1.length = salary1.length - 1
      salary2 = [salary2[0]]
      that.setData({
        conf: post,
        salaryi: post.salary,
        educationi: post.education,
        experiencei: post.experience,
        salary_filteri: post.salary_filter,
        salary1: salary1,
        salary2: salary2,
        cate: [post.cate]
      })
      util.hideLoading()
    })
  },
  init(page = 1) {
    var that = this;
    var data = {}
    // { source: "offline", cate_id: that.data.cate_id, page: page, keywords: that.data.keywords, area_id: that.data.area_id, location: that.data.location, feature: this.data.feature, cost: this.data.cost, sort: that.data.sort }

    util.getJSON({
      apiUrl: apiurl.recruit.postIndex + "?1=1",
      data: data
    }, function (res) {
      var result = res.data.result
      var list = result.list
      if (page != 1) {
        list = that.data.list.concat(list)
      }
      that.setData({
        list: list,
        page: result.page,
        hideHeader: true,
        hideBottom: true
      })
      wx.hideLoading()
    })
  },
  addressd(pid, name, cb) {
    var that = this;
    util.getJSON({ apiUrl: apiurl.area + pid }, function (res) {
      var area = res.data.result.list, array = []
      area.unshift({
        "area_id": pid,
        "name": "全" + name,
        "type": "",
        "parent_id": "",
        "sort": "0"
      })
      cb(area)
    })
  },
  areaparse() {
    var that = this;
    that.addressd(wx.getStorageSync('locAddressID'), wx.getStorageSync('locAddress'), function (e) {
      var eara = [], earaid = []
      eara.push(e)
      earaid.push(e[0]["area_id"])
      that.setData({
        eara: eara,
        earaid: earaid
      })
    })
  },
  filterTab(e) {
    var index = e.currentTarget.dataset.index;
    var qyopen = true, isfull = true, sort = this.data.sort
    
    this.setData({
      tabIndex: index,
      qyopen: qyopen,
      qyshow: false,
      isfull: isfull
    })
    
  },
  hidebg: function (e) {
    this.setData({
      qyopen: false,
      isfull: false,
      tabIndex: -1
    })
  },
  choose1(e) {
    var that = this;
    var tabTxt = this.data.tabTxt
    tabTxt[1] = e.currentTarget.dataset.name;
    var id = e.currentTarget.dataset.id
    if (e.currentTarget.dataset.indexnum == 0 && e.currentTarget.dataset.id != this.data.eara[0][0]['area_id']) {
      that.addressd(e.currentTarget.dataset.id, e.currentTarget.dataset.name, function (e) {
        var eara = that.data.eara, earaid = that.data.earaid
        eara[1] = e
        earaid[0] = id
        earaid[1] = e[0]["area_id"]
        that.setData({
          eara: eara,
          earaid: earaid
        })
      })
    }

    var earaid = that.data.earaid;
    earaid[e.currentTarget.dataset.indexnum] = e.currentTarget.dataset.id
    that.setData({
      earaid: earaid,
      tabTxt: tabTxt
    })
  },
  submitFilter1() {
    this.setData({
      area_id: this.data.earaid[this.data.earaid.length - 1],
      sort: 'location',
      location: this.data.longitude + ',' + this.data.latitude
    })
    // this.init()
    this.hidebg()
  },
  quyuEmpty1() {
    var eara = this.data.eara, earaid = this.data.earaid
    eara.length = 1;
    // earaid.length = 1;
    console.log(earaid)
    var tabTxt = this.data.tabTxt
    tabTxt[1] = '成都';
    this.setData({
      eara: eara,
      earaid: [wx.getStorageSync('locAddressID')],
      area_id: '',
      tabTxt: tabTxt
    })
    // this.hidebg()
    // this.init()
  },
  choose2(e) {
    var that = this;
    var tabTxt = this.data.tabTxt, cate = this.data.cate, cateid=this.data.cateid
    tabTxt[2] = e.currentTarget.dataset.name;
    console.log(e)
    console.log(cate[e.currentTarget.dataset.indexnum])
    // cate[e.currentTarget.dataset.indexnum][[e.currentTarget.dataset.index]
    if (cate[e.currentTarget.dataset.indexnum][e.currentTarget.dataset.index]["children"]){
      cate[e.currentTarget.dataset.indexnum + 1] = cate[e.currentTarget.dataset.indexnum][e.currentTarget.dataset.index]["children"]
      cateid[e.currentTarget.dataset.indexnum +1] = cate[e.currentTarget.dataset.indexnum][e.currentTarget.dataset.index]["children"][0]["id"]
      that.setData({
        cate: cate,
        cateid: cateid
      })
    }
    cateid[e.currentTarget.dataset.indexnum] = e.currentTarget.dataset.id
    that.setData({
      cateid: cateid,
      tabTxt: tabTxt
    })
    
  },
  submitFilter2() {
    this.setData({
      cate_id: this.data.cateid[this.data.earaid.length - 1],
    })
    // this.init()
    this.hidebg()
  },
  quyuEmpty2() {
    var cate = this.data.cate, cateid = this.data.cateid
    cate.length = 1;
    var tabTxt = this.data.tabTxt
    tabTxt[2] = '行业';
    this.setData({
      cate: cate,
      cateid: [],
      cate_id: '',
      tabTxt: tabTxt
    })
    this.hidebg()
    // this.init()
  },
  choose3(e){
    console.log(e)
    this.setData({
      [e.currentTarget.dataset.name]: e.currentTarget.dataset.id
    })
  },
  submitFilter3() {
    this.setData({
      experience: this.data.experience,
      education: this.data.education,
      salary: this.data.salary
    })
    this.hidebg()
  },
  quyuEmpty3() {
    
    this.setData({
      experience: '',
      education: '',
      salary: ''
    })
    this.hidebg()
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