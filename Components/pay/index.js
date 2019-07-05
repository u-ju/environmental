const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    // 弹窗标题
    title: {            // 属性名
      type: String,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '立即支付'     // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    title1: {            // 属性名
      type: String,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '立即支付'     // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    data: {
      type: Object,
      value: {},
    },
    classN: {
      type: String,
      value: ''
    },
    styles: {
      type: String,
      value: ''
    },
    choose: {
      type: String,
      value: ''
    },
  },

  data: {
    // areaSelectedStr: '',
    // area_id_val: 0,
    // maskVisual: 'hidden',
    // disabled: false,
    // item: '',
    // url: 'shippingAddress_store',
    // cengji: [{ currentname: '请选择', array: [], area: [], currentindex: -1 }],
    // currentindex: 0,
    // current:0,
    // isbiotope:false,
    // biotopecurrent:-1,
    // biotope_name:'',
    visible3:false
  },

  methods: {
    /*
     * 公有方法
     */

    onload(){
      this.loadAddress()
    },
    tap(){
      var that = this
      console.log(1)
      this.triggerEvent('open',{page:that})
    },
    open3() {
      var that = this;
      
      // console.log(that.data.data)
      util.postJSON({ apiUrl: apiurl.create, data: that.data.data },
        function (res) {
          var result = res.data.result
          if (result.pay_amount==0){
            that.setData({
              items: result,
              pay_amount: result.pay_amount,
              payment: "balance"
            })
            return that.goodsBuy()
          }
          
          for (let i in result.payment_usable) {
            result.payment_usable[i].choosed = 0
          }
          result.payment_usable[0].choosed = 1
          that.setData({
            items: result,
            visible3: true,
            pay_amount: result.pay_amount,
            payment: result["payment_usable"][0]["key"]
          })
        })
    },
    close3() {
      this.setData({
        visible3: false,
      })
    },
    onClose3() {
      this.setData({
        visible3: false,
      })
    },
    choose(e) {
      var items = this.data.items;
      for (let i in items.payment_usable) {
        items.payment_usable[i].choosed = 0
        if (items.payment_usable[i].options && this.data.payment_ext) {
          for (let a in items.payment_usable[i].options) {
            items.payment_usable[i].options[a].choosed = 0
          }
        }
      }
      items["payment_usable"][e.currentTarget.dataset.index]["choosed"] = 1
      var pay_amount = items["payment_usable"][e.currentTarget.dataset.index]["pay_amount"] || items.pay_amount
      this.setData({
        items: items,
        fq: e.currentTarget.dataset.index,
        pay_amount: pay_amount,
        payment: items["payment_usable"][e.currentTarget.dataset.index]["key"]
      })
    },
    goodsBuy() {
      var that = this;
      that.setData({
        visible3: false,
      })
      wx.showLoading({
        title: '加载中',
        mask: true,
        duration: 40000,
      })
      var data = { pay_key: that.data.items.pay_key, payment: that.data.payment, pay_amount: that.data.pay_amount, pay_cash: that.data.pay_amount }
        // , payment_ext: that.data.payment_ext
      if (that.data.payment =='wechat'){
        data.payment_ext = util.wx_appid
      }
      util.postJSON({ apiUrl: apiurl.vendor, data: data },
        function (res) {
          var result = res.data.result
          if (result.payment == "balance" || result.payment == "installment") {
            util.postJSON({ apiUrl: apiurl.query, data: { pay_key: result.pay_key } }, function (res2) {
              // util.alert("支付成功")
              
            }, function () {
              
            }, function () {
              
            })
          } else if (result.payment == "wechat") {
            wx.requestPayment({
              timeStamp: result.pay_info.timeStamp,
              nonceStr: result.pay_info.nonceStr,
              package: result.pay_info.package,
              signType: result.pay_info.signType,
              paySign: result.pay_info.paySign,
              success(res1) {
                util.postJSON({ apiUrl: apiurl.query, data: { pay_key: result.pay_key } }, function (res2) {
                  // wx.hideLoading()
                  wx.setStorageSync('wechatpay', 1)
                }, function () {
                  // wx.hideLoading()
                  
                }, function () {
                  // wx.hideLoading()
                  
                })
              },
              fail(res) {
                util.alert("支付失败")
              }
            })
          }
        })
    },
    
  }
})