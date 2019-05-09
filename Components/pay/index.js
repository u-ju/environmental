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
      
      console.log(that.data.data)
      util.postJSON({ apiUrl: apiurl.create, data: that.data.data },
        function (res) {
          var result = res.data.result
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
      })
      var data = { pay_key: that.data.items.pay_key, payment: that.data.payment, pay_amount: that.data.pay_amount, pay_cash: that.data.pay_amount, payment_ext: that.data.payment_ext }
      util.postJSON({ apiUrl: apiurl.vendor, data: data },
        function (res) {
          var result = res.data.result
          if (result.payment == "balance" || result.payment == "installment") {
            util.postJSON({ apiUrl: apiurl.query, data: { pay_key: result.pay_key } }, function (res2) {
              util.alert("支付成功")
              
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
                  wx.hideLoading()
                  
                }, function () {
                  wx.hideLoading()
                  
                }, function () {
                  wx.hideLoading()
                  
                })
              },
              fail(res) {
                util.alert("支付失败")
              }
            })
          }
        })
    },
    // 地区选择
    // loadAddress: function (options) {
    //   var that = this;
    //   this.getArea(0, function (array, area) {
    //     var cengji = that.data.cengji
    //     cengji[0]['array'] = array
    //     cengji[0]['area'] = area
    //     that.setData({
    //       cengji: cengji
    //     });
    //   });
    // },
    // cascadePopup: function () {
    //   var animation = wx.createAnimation({
    //     duration: 500,
    //     timingFunction: 'ease-in-out',
    //   });
    //   this.animation = animation;
    //   animation.translateY(-285).step();
    //   this.setData({
    //     animationData: this.animation.export(),
    //     maskVisual: 'show'
    //   });
    // },
    // cascadeDismiss: function () {
    //   this.animation.translateY(285).step();
    //   this.setData({
    //     animationData: this.animation.export(),
    //     maskVisual: 'hidden'
    //   });
    // },
    // choosearea(e) {
    //   var that = this;
    //   var index = e.currentTarget.dataset.index;
    //   var cengji = this.data.cengji;
    //   cengji[this.data.current]['currentname'] = this.data.cengji[this.data.current]['array'][index]
    //   cengji[this.data.current]['currentindex'] = index
    //   this.setData({
    //     cengji: cengji
    //   });
      
    //   if (cengji[this.data.current]['area'][0]["type"]==that.data.ban){//在哪一层停止
    //     var areaSelectedStr = ''
    //     for (var i in cengji) {
    //       areaSelectedStr = areaSelectedStr + " " + cengji[i].currentname
    //       if (cengji[i]['area'][0]["type"] == that.data.tokonw) {//知道与之对应的选择的昵称
    //         this.setData({
    //           konwname: cengji[i].currentname
    //         })
    //       }
    //     }
    //     that.cascadeDismiss();
    //     return that.triggerEvent("choosea", { areaSelectedStr: areaSelectedStr, area_id_val: that.data.cengji[that.data.current]['area'][index]["area_id"], area: that.data.cengji[that.data.current]['area'][index], isbiotope: that.data.isbiotope, konwname: that.data.konwname })
    //   }
      
    //   console.log(cengji[this.data.current]['area'][0]["type"])
    //   if (cengji[this.data.current]['area'][0]["type"] == 'biotope') {
    //     this.setData({
    //       isbiotope: true,
    //       biotopecurrent: this.data.current,
    //       biotope_name: cengji[this.data.current]['array'][index]
    //     })
    //   }
    //   if (this.data.current < that.data.biotopecurrent) {
    //     this.setData({
    //       isbiotope: false,
    //       biotope_name:''
    //     })
    //   }
    //   this.getArea(this.data.cengji[that.data.current]['area'][index]["area_id"], function (array, area) {
    //     if (area.length == 0) {
    //       var areaSelectedStr = ''
    //       for (var i in cengji) {
    //         if (i > that.data.current) {
    //           cengji.splice(i, 1)
             
    //         }else{
    //           areaSelectedStr = areaSelectedStr + " " + cengji[i].currentname
    //         }
            
    //       }
    //       that.setData({
    //         areaSelectedStr: areaSelectedStr,
    //         area_id_val: that.data.cengji[that.data.current]['area'][index]["area_id"]
    //       });
    //       that.cascadeDismiss();
    //       return that.triggerEvent("choosea", { areaSelectedStr: areaSelectedStr, area_id_val: that.data.cengji[that.data.current]['area'][index]["area_id"], area: that.data.cengji[that.data.current]['area'][index], isbiotope: that.data.isbiotope, biotope_name: that.data.biotope_name, konwname: that.data.konwname})
    //     }
    //     // var current = that.data.current

    //     if (that.data.currentindex <= that.data.current) {
    //       cengji.push({ currentname: '请选择', array: array, area: area, currentindex: -1 })

    //     } else {

    //       for (var i in cengji) {
    //         if (i > that.data.current) {
    //           cengji.splice(i, 1)
    //         }
    //       }
    //       cengji[that.data.current + 1] = { currentname: '请选择', array: array, area: area, currentindex: -1 }
    //     }
    //     that.setData({
    //       cengji: cengji,
    //       current: that.data.current + 1,
    //       currentindex: that.data.current + 1,
    //     });

    //   });
    // },
    // getArea: function (pid, cb) {
    //   var that = this;
    //   util.getJSON({ apiUrl: apiurl.area + pid }, function (res) {
    //     var area = res.data.result.list, array = []
    //     for (var i = 0; i < area.length; i++) {
    //       array[i] = area[i]['name'];
    //     }
    //     cb(array, area)
    //   })
    // },
    // currentChanged: function (e) {
    //   // swiper滚动使得current值被动变化，用于高亮标记
    //   var current = e.detail.current;
    //   this.setData({
    //     current: current
    //   });
      
    // },
    // changeCurrent: function (e) {
    //   // 记录点击的标题所在的区级级别
    //   var current = e.currentTarget.dataset.current;
    //   this.setData({
    //     current: current,
    //     // currentindex: current,
    //   });
    // },
  }
})