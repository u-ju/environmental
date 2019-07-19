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
    tabTxt1: ['最新', '成都 ', '行业', '要求'],
    list:[0],
    tabIndex:-1,
    qyopen: false,
    isfull: false,
    cateid:[],
    cate:[],
    experience:'',
    education:'',
    salary:'',
    // [{ "key": "sort", "value": "recommend", "description": "newest\nrecommend", "type": "text", "enabled": false }]
    sorti:[
      { name: '推荐', key: 'nrecommend' },
      { name: '最新', key: 'newest' },
    ],
    sort:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      address: wx.getStorageSync('locAddresscity') || wx.getStorageSync('locAddress'),
      keywords: options.keywords||''
    })
    util.loading()
    this.areaparse()
    this.init()
    this.conf()
  },
  search(e) {
    this.setData({
      keywords: e.detail.value
    })
    if (e.detail.value == '') {
      this.init()
    }
  },
  searchSubmit(e) {
    this.init()
  },
  detail(e){
    getApp().globalData.id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: 'positionDetails/index?id=' + e.currentTarget.dataset.id,
    })
  },
  link(){
    wx.navigateTo({
      url: 'cardCreate/index',
    })
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
    var data = {
      experience: that.data.experience||'',
      education: that.data.education || '',
      salary: that.data.salary || '',
      cate_id: that.data.cate_id || '',
      keywords: that.data.keywords || '',
      area_id: that.data.area_id || '',
      sort: that.data.sort || ''
    }
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
      isfull: isfull,
      experiencef: this.data.experience,
      educationf: this.data.education,
      salaryf: this.data.salary,
    })
    
  },
  hidebg: function (e) {
    this.setData({
      qyopen: false,
      isfull: false,
      tabIndex: -1
    })
  },
  choose0(e) {
    console.log(e)
    this.setData({
      sortf: e.currentTarget.dataset.key,
      sortfname: e.currentTarget.dataset.name
    })
  },
  submitFilter0() {
    var tabTxt = util.copyarr(this.data.tabTxt1)
    tabTxt[0] = this.data.sortfname;
    this.setData({
      tabTxt: tabTxt,
      sort: this.data.sortf,
      experience: '',
      education: '',
      salary: '',
      cate_id: '', 
      keywords: '', 
      area_id: '', 
    })
    this.hidebg()
  },
  quyuEmpty0() {
    this.setData({
      sort: '',
      tabTxt: util.copyarr(this.data.tabTxt1)
    })
    this.hidebg()
  },
  choose1(e) {
    util.areatab(this, e.currentTarget.dataset.indexnum, e.currentTarget.dataset.id, e.currentTarget.dataset.name, 1)
  },
  submitFilter1() {
    var tabTxt = util.copyarr(this.data.tabTxt1)
    tabTxt[1] = this.data.earaname;
    this.setData({
      tabTxt: tabTxt,
      area_id: this.data.earaid[this.data.earaid.length - 1],
      sort: '',
      experience: '',
      education: '',
      salary: '',
      keywords: '',
      cate_id: '', 
    })
    this.init()
    this.hidebg()
  },
  quyuEmpty1() {
    var eara = this.data.eara, earaid = this.data.earaid
    eara.length = 1;
    console.log(earaid)
    var tabTxt = util.copyarr(this.data.tabTxt1)
    this.setData({
      eara: eara,
      earaid: [wx.getStorageSync('locAddressID')],
      area_id: '',
      tabTxt: util.copyarr(this.data.tabTxt1)
    })
    // this.hidebg()
    // this.init()
  },
  choose2(e) {
    var that = this;
    var  cate = this.data.cate, cateid=this.data.cateid
    // tabTxt[2] = e.currentTarget.dataset.name;
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
      catename: e.currentTarget.dataset.name
    })
    
  },
  submitFilter2() {
    var tabTxt = util.copyarr(this.data.tabTxt1)
    tabTxt[2] = this.data.catename;
    this.setData({
      tabTxt: tabTxt,
      cate_id: this.data.cateid[this.data.earaid.length - 1],
      sort: '',
      experience: '',
      education: '',
      salary: '',
      keywords: '',
      area_id: '', 
    })
    this.init()
    this.hidebg()
  },
  quyuEmpty2() {
    var cate = this.data.cate, cateid = this.data.cateid
    cate.length = 1;
    this.setData({
      cate: cate,
      cateid: [],
      cate_id: '',
      tabTxt: util.copyarr(this.data.tabTxt1)
    })
    this.hidebg()
  },
  choose3(e){
    console.log(this.data[e.currentTarget.dataset.name])
    var a = e.currentTarget.dataset.name
    this.setData({
      [a]: e.currentTarget.dataset.id,
    })
    console.log(this.data[e.currentTarget.dataset.name])
  },
  submitFilter3() {
    this.setData({
      experience: this.data.experiencef,
      education: this.data.educationf,
      salary: this.data.salaryf
    })
    this.init()
    this.hidebg()
  },
  quyuEmpty3() {
    
    this.setData({
      experiencef: '',
      educationf: '',
      salaryf: '',
      experience: '',
      education: '',
      salary: '',
      cate_id: '',
      keywords: '',
      area_id: '', 
      sort:''
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