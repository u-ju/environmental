// pages/edcs/edcs.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentData: 1,
    tab: [ 
      { id: 1, name: "订单列表" },
      { id: 2, name: "分拣记录" },
    ],
    news: [],
    cate_id: 1,
    last: false,
    xiala: false,
    pay:'',
    pay1:'',
    station:[],
    bag:[],
    list1:[],
    list:[],
    pay_val:0,
    pay1_val:0,
    ing:[],
    casArray: [],
    order_type: '',
    payment: '',
    is_password: '',
    payment_usable: [
      { image: "../../images/gold.png", text: '余额支付', checked: 'true' },
      { image: "../../images/weixin@2x.png", text: '环保金支付', checked: '' }
    ],
    result1:{},
    visible2:false,
    qrcode:''
  },

  /**1
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // if (wx.getStorageInfoSync("is_password") == '') {
    //   util.getJSON({ apiUrl: apiurl.wallet }, function (res) {
    //     wx.setStorageSync("is_password", res.data.result.is_password)
    //     that.setData({
    //       is_password: res.data.result.is_password
    //     })
    //   })
    // }
    // util.getJSON({ apiUrl: apiurl.config }, function (res) {
    var result = app.globalData.config;
      that.setData({
        bag: result.garbage_bag_order_status,
        station: result.garbage_station_order_status,
        pay: result.garbage_station_order_status[0].name,
        pay1: result.garbage_bag_order_status[0].name,
        casArray: result.onsite_recycle_order_type
      })
    // })
    if (options.currentData){
      that.setData({
        currentData: options.currentData
      })
    }
    that.init1()
  },
  xiala(){
    this.setData({
      xiala: !this.data.xiala
    })
  },
  select(e){
    this.setData({
      pay: e.currentTarget.dataset.name,
      pay_val: e.currentTarget.dataset.id,
      xiala: !this.data.xiala
    })
    this.init(e.currentTarget.dataset.id)
  },
  select1(e) {
    this.setData({
      pay1: e.currentTarget.dataset.name,
      pay1_val: e.currentTarget.dataset.id,
      xiala: !this.data.xiala
    })
    // console.log(e.currentTarget.dataset.id)
    this.init1(e.currentTarget.dataset.id)
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
  //获取当前滑块的index
  bindchange: function (e) {
    const that = this;
    
    that.setData({
      currentData: e.detail.current
    })
  },
  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    const that = this;
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      if (e.target.dataset.current==0){
        that.init()
      }else{
        that.init1()
      }
      that.setData({
        currentData: e.target.dataset.current,
        news: ""
      })
    }
  },
  init(order_status = 0) {
    var that = this;
    util.getJSON({
      apiUrl: apiurl.stationOrderIndex + '?order_status=' + order_status 
    }, function (res) {
      var result = res.data.result;
     
      that.setData({
        list: result.list
      })
      wx.hideLoading()
    })
  },
  init1(order_status = 0) {
    var that = this;
    util.getJSON({
      apiUrl: apiurl.bagOrderSorterIndex + '?order_status=' + order_status
    }, function (res) {
      var result = res.data.result
      var ing = that.data.ing;
      if (order_status == 0) {
        ing = result.list
      }
      that.setData({
        list1: result.list,
        ing: ing
      })
      wx.hideLoading()
    })
  },
  fenjian(e){
    wx.navigateTo({
      url: '../sorting/sorting?order_id=' + e.currentTarget.dataset.order_id + "&status=" + this.data.pay1_val,
    })
  },
  show() {//不跳页面
    var that = this;
    var show;
    wx.scanCode({
      success: (rest) => {
        that.setData({
          qrcode: rest.result
        })
        util.postJSON({ apiUrl: apiurl.qrCode, data: { qrcode: rest.result } }, function (res) {
          var results = res.data.result
          util.postJSON({ apiUrl: apiurl.action, data: { action: results.action[0].key, code: results.code} }, function (res) {
            var result1 = res.data.result
            util.deplay_navigateTo('../sorting/sorting?qrcode=' + result1.params.bag_no + "&status=0")
            wx.hideLoading()
          })
        })
        // if (wx.getStorageInfoSync("pay_deposit")){
          
          // util.postJSON({ apiUrl: apiurl.create, data: { pay_source: "deposit" } }, function (res1) {
          //   console.log(res1)
          //   that.setData({
          //     result1: res.data.result
          //   })
          //   wx.hideLoading()
          // })
          // that.open2()
        // }else{
          
        // }
      },
      fail: (res) => {
        // wx.showToast({
        //   title: '失败',
        //   duration: 2000
        // })
        util.alert('失败')
      },
      complete: (res) => {
      }
    })
  },
  all_order(){
    var that = this;
    var bag = {};
    for (var key in that.data.ing){
      bag["order_id[" + key + "]"] = that.data.ing[key].order_id
    }
    bag = JSON.stringify(bag);
    wx.navigateTo({
      url: '../sorting_all/sorting_all?bag='+bag,
    })
  },
  order(e){
    wx.navigateTo({
      url: '../sorting_list_detail/index?order_id=' + e.currentTarget.dataset.order_id,
    })
  },
  radioChange: function (e) {//入驻类型选择
    this.setData({
      payment: e.detail.value
    })
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  open2() {
    var that = this;
    util.postJSON({ apiUrl: apiurl.create, data: { pay_source: "deposit" }  },
      function (res) {
        var result = res.data.result
        console.log(res)
        var payment_usable = that.data.payment_usable
        for (var key in result.payment_usable) {
          payment_usable[key]["text"] = result.payment_usable[key]["name"]
          payment_usable[key]["key"] = result.payment_usable[key]["key"]
        }
        that.setData({
          result: result,
          payment_usable: payment_usable,
          visible2: true,
          payment: payment_usable[0]["key"]
        })
      })

  },
  close2() {
    var that = this;
    that.setData({
      visible2: false,
    })
    wx.showLoading({
      title: '加载中',
    })
    util.postJSON({ apiUrl: apiurl.vendor, data: { pay_key: that.data.result.pay_key, payment: that.data.payment, pay_amount: that.data.result.pay_amount, pay_cash: that.data.result.pay_amount } },
      function (res) {
        var result = res.data.result
        console.log(res)
        if (result.payment == "balance") {
          util.postJSON({ apiUrl: apiurl.query, data: { pay_key: result.pay_key } }, function (res2) {
            util.alert("支付成功")
            that.init()
          }, function () {
            that.init()
          }, function () {
            that.init()
          })
        } else {
        wx.requestPayment({
          timeStamp: result.pay_info.timeStamp,
          nonceStr: result.pay_info.nonceStr,
          package: result.pay_info.package,
          signType: result.pay_info.signType,
          paySign: result.pay_info.paySign,
          success(res1) {
            console.log(res1)
            wx.hideLoading()
            util.postJSON({ apiUrl: apiurl.query, data: { pay_key: result.pay_key } }, function (res2) {
                util.deplay_navigateTo('../sorting/sorting?qrcode=' + that.data.qrcode + "&status=0")
            }, function () {
              util.deplay_navigateTo('../sorting/sorting?qrcode=' + that.data.qrcode + "&status=0")
            }, function () {
              util.deplay_navigateTo('../sorting/sorting?qrcode=' + that.data.qrcode + "&status=0")
            })
          },
          fail(res) {
            util.alert("支付失败")
          }
        })
        }
      })
    // this.setData({
    //   visible2: false,
    // })
  },
  onClose(key) {
    console.log('onClose')
    this.setData({
      [key]: false,
    })
  },
  onClose2() {
    this.onClose('visible2')
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