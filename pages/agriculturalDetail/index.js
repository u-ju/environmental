// pages/agriculturalDetail/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
var lastTime = new Date().getTime();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true, //显示面板指示点
    autoplay: true, //自动播放
    beforeColor: "#DCDCDC", //指示点颜色
    afterColor: "#27AAD9", //当前选中的指示点颜色
    interval: 5000,
    duration: 1000,
    banner: [],
    result: "",
    visible1: false,
    visible2: false,
    visible3: false,
    cc: [
    ],
    ys: [
    ],
    items: [
    ],
    cartArr: [{
      name: '1',
      value: '已阅读分期协议'
    },],
    current: 0,
    list: [],
    result: {},
    page: {},
    choosespec: [],
    specifications: [],
    disable: false,
    count: 1,
    buyok: false,
    commentIndex: 1,
    list1: [],
    chooseqx: [{
      name: 1,
      value: '全选',
      checked: true
    },],
    choose: ['1'],
    visiblec: false,
    choosecar: {
      sku_id: [],
      count: [],
      price: []
    },
    allchoosecar: {
      sku_id: [],
      count: [],
      price: []
    },
    carmoney: 0,
    all: 0,
    addshopcarnum: 0,
    goodsCart: [0],
    npers: true,
    nper: ''
  },
  swiper(e) {
    this.setData({
      current: e.detail.current
    })
  },
  open1() {
    this.setData({
      visible1: true,
    })
  },
  open2() {
    this.setData({
      visible2: true,
    })
  },
  open3() {
    this.setData({
      visible3: true,
    })
  },
  close1() {
    this.setData({
      visible1: false,
    })
  },
  close2() {
    this.setData({
      visible2: false,
    })
  },
  close3() {
    this.setData({
      visible3: false,
    })
  },
  onClose(key) {
    this.setData({
      [key]: false,
    })
  },
  onClose1() {
    this.onClose('visible1')
  },
  onClose2() {
    this.onClose('visible2')
  },
  onClose3() {
    this.onClose('visible3')
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },
  // 查看图片
  previewImg(e) {
    util.previewImage(e.currentTarget.dataset.src, this.data.result.images)
  },
  link(e) {
    wx.navigateTo({
      url: '../page/index?url=' + e.currentTarget.dataset.url,
    })
  },
  fqtz() {
    wx.navigateTo({
      url: '../page/index?url=' + app.globalData.config.protocol.nper,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var that = this;
    util.loading()
    that.setData({
      sku_id: options.id,
      // nper: app.globalData.config.protocol.nper
      // 
    })
    that.goods(options.id)
    that.goodsCart()
  },
  goods(id) {
    var that = this;
    util.getJSON({
      apiUrl: apiurl.goods_show + id
    }, function (res) {
      var result = res.data.result
      var choosed = [result.sku_key]
      var choosedkey = result.sku_key,
        arr = [],
        spec_values = res.data.result.spec_values
      if (result.sku_key.indexOf('-') > -1) {
        choosed = result.sku_key.split('-')
      }
      for (var n in choosed) {
        arr[n] = [];
      }
      for (var a in spec_values) {
        for (var b in choosed) {
          if (choosed[b][2] == spec_values[a].sku_key.split("-")[b][2] && result.sku_key.indexOf('-') > -1) {
            for (var c in choosed) {
              if (arr[c].indexOf(spec_values[a].sku_key.split("-")[c][2]) == -1 && b != c) {
                arr[c].push(spec_values[a].sku_key.split("-")[c][2])
              }
            }
          } else if (result.sku_key.indexOf('-') == -1) {
            arr[b].push(spec_values[a].sku_key[2])
          }
        }
      }
      var seckill_price = result.seckill_info && result.seckill_info.seckill_price
      that.setData({
        result: result,
        choosed: choosed,
        spu_id: result.spu_id,
        arr: arr,
        seckill_price: seckill_price||'',
        comment_score: Math.ceil(result.comment_score)
      })

      that.commentIndex(result.spu_id)
      // that._click(choosed, result.spec_values, result,1)
      util.hideLoading()
    })
  },
  goodsCart() {
    var that = this;
    util.getJSON({
      apiUrl: apiurl.goodsCart_index
    }, function (res) {
      var list = res.data.result.list
      var result = res.data.result,
        allchoosecar = {
          sku_id: [],
          price: [],
          count: [],
        },
        choosecar = {
          sku_id: [],
          price: [],
          count: [],
        }
      for (var i in list) {
        allchoosecar.sku_id[i] = []
        allchoosecar.price[i] = []
        allchoosecar.count[i] = []
        choosecar.sku_id[i] = []
        choosecar.price[i] = []
        choosecar.count[i] = []
        for (var j in list[i]["goods_arr"]) {
          allchoosecar.sku_id[i].push(list[i]["goods_arr"][j].sku_id)
          allchoosecar.price[i].push(list[i]["goods_arr"][j].price)
          allchoosecar.count[i].push(list[i]["goods_arr"][j].count)
        }
      }

      that.setData({
        goodsCart: list,
        allchoosecar: allchoosecar,
        choosecar: choosecar,
        countnum: result.count
      })
      util.hideLoading()
    })
  },
  commentIndex(spu_id, page = 1) {
    var that = this;
    util.getJSON({
      apiUrl: apiurl.goods_commentIndex + spu_id + "&page=" + page
    }, function (res) {
      var list = res.data.result.list
      var result = res.data.result
      var list1 = []
      for (var i in list) {
        list[i].created_at = list[i].created_at.split(" ")[0]
      }
      if (list.length > 0) {
        list1.push(list[0])
      }
      that.setData({
        list: list,
        list1: list1,
        page: result.page
      })
      util.hideLoading()
    })
  },
  // 选择规格时的选项情况
  _click(choosed, spec_values = this.data.result.spec_values, result = this.data.result, init) {
    // var disable = false
    var arr = [],
      that = this;
    for (var n in choosed) {
      arr[n] = [];
    }
    var choosedkey = choosed.join('-')
    // 都选时

    for (var a in spec_values) {
      for (var b in choosed) {
        if (choosed[b][2] == spec_values[a].sku_key.split("-")[b][2] && result.sku_key.indexOf('-') > -1) {
          for (var c in choosed) {
            if (arr[c].indexOf(spec_values[a].sku_key.split("-")[c][2]) == -1 && b != c) {
              arr[c].push(spec_values[a].sku_key.split("-")[c][2])
            }
          }
        } else if (result.sku_key.indexOf('-') == -1) {
          arr[b].push(spec_values[a].sku_key[2])
        }
      }
    }



    if (choosedkey.indexOf('u') > -1) {
      // 未完全勾选时
      var num = 0
      // 部分未勾选时
      for (var m in choosed) {
        if (choosed[m][2] != 'u') {
          for (var a in spec_values) {
            if (arr[m].indexOf(spec_values[a].sku_key.split("-")[m][2]) == -1) {
              arr[m].push(spec_values[a].sku_key.split("-")[m][2])
            }
          }
        } else {
          num = num + 1
        }
      }
      // 全部未勾选时
      if (num == choosed.length) {
        for (var p in choosed) {
          for (var q in spec_values) {
            if (arr[p].indexOf(spec_values[q].sku_key.split("-")) == -1) {
              arr[p].push(spec_values[q].sku_key.split("-")[p][2])
            }
          }
        }
      }
    } else {
      for (var u in spec_values) {
        if (choosedkey == spec_values[u]['sku_key'] && result.sku_id != spec_values[u]['sku_id']) {

          return that.goods(spec_values[u]['sku_id'])
        }
      }
    }


    that.setData({
      arr: arr,
      result: result
    })
  },

  choose(e) {
    var list = this.data.items
    for (let i in list) {
      list[i].choosed = 0
    }
    list[e.currentTarget.dataset.id]["choosed"] = 1
    this.setData({
      items: list
    })
  },
  choosed(e) {
    var list = this.data.cartArr
    list[e.currentTarget.dataset.id]["choosed"] = !e.currentTarget.dataset.choosed
    this.setData({
      cartArr: list
    })

  },
  choosespecs(e) {
    if (e.currentTarget.dataset.click == -1) {
      return false
    }
    var choosed = this.data.choosed;
    for (var i in choosed) {
      if (choosed[i][0] == e.currentTarget.dataset.spec_id) {
        var a = choosed[i];
        a = a.split('') //将a字符串转换成数组
        if (choosed[i][2] == e.currentTarget.dataset.spec_value_id) {
          a.splice(2, 1, 'u')
        } else {
          a.splice(2, 1, e.currentTarget.dataset.spec_value_id)
        }

        choosed[i] = a.join('')
      }
    }
    this.setData({
      choosed: choosed
    })
    this._click(choosed)
  },
  buy(e) {
    var that = this;
    for (var i in that.data.choosed) {
      if (that.data.choosed[i].indexOf("u") != -1) {
        return util.alert("请选择" + that.data.result.specs[i]["spec_name"])
      }
    }
    var data = {
      buy_type: "seckill",
      'sku_arr[0][sku_id]': that.data.result.sku_id,
      'sku_arr[0][count]': that.data.count
    }
    that.setData({
      buyok: true
    })

    util.postJSON({
      apiUrl: apiurl.order_payShow,
      data: data
    }, function (res) {
      var result = res.data.result
      getApp().globalData.order_detail = result
      wx.navigateTo({
        url: '../order_detail/index',
      })
      that.setData({
        buyok: false,
        visible1: false
      })
    }, function (res) {
      that.setData({
        buyok: false
      })
    }, function (res) {
      that.setData({
        buyok: false
      })
    })
  },
  onChange(e) {
    this.setData({
      count: e.detail.value,
    })
  },
  more() {
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
      mask: true
    })
    if (this.data.commentIndex == 1) {
      wx.hideLoading()
      return this.setData({
        commentIndex: 0
      })
    }
    // 页数+1
    if (Number(that.data.page.current_page) != Number(that.data.page.last_page)) {
      that.commentIndex(that.spu_id, Number(that.data.page.current_page) + 1)
    } else {
      that.setData({
        last: true
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 1000)
    }
  },
  contact(e) {
    console.log(e)
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.contact, //此号码并非真实电话号码，仅用于测试
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  //购物车事件处理函数
  /*点击减号*/
  bindcz(e) {
    var symbols = e.currentTarget.dataset.symbols,
      num = e.currentTarget.dataset.num,
      index = e.currentTarget.dataset.index,
      listnum = e.currentTarget.dataset.listnum,
      list = this.data.goodsCart,
      sku_id = e.currentTarget.dataset.sku_id;
    var that = this;
    var skuID_last = this.data.skuID_last || e.currentTarget.dataset.sku_id,
      num_last = that.data.num_last;
    var allchoosecar = that.data.allchoosecar;
    if (symbols == 'add') {
      num++
    } else {
      num--
    }
    console.log(list, listnum)
    list[listnum]["goods_arr"][index]["count"] = num

    if (skuID_last != sku_id) {
      that.updatacar(skuID_last, num_last, listnum);

    }
    allchoosecar.count[listnum][allchoosecar.sku_id[listnum].indexOf(sku_id)] = num
    that.setData({
      goodsCart: list,
      allchoosecar: allchoosecar,
      skuID_last: sku_id,
      num_last: num
    })
    var choosecar = that.data.choosecar;
    if (choosecar.sku_id[listnum].indexOf(sku_id) > -1) {
      choosecar.count[listnum][choosecar.sku_id[listnum].indexOf(sku_id)] = num
      that.setData({
        choosecar: choosecar
      })
      that.carmoney()
    }
    lastTime = new Date().getTime();
    setTimeout(function () {
      if (lastTime + 2000 > new Date().getTime()) {
        return;
      }
      that.updatacar(sku_id, num, listnum);
    }, 2000)
  },
  goodsCartclear() {
    var that = this;
    util.postJSON({
      apiUrl: apiurl.goodsCart_clear
    }, function (res) {
      util.alert(res.data.message)
      that.goodsCart()
    })
  },
  updatacar(sku_id, count, listnum, suc) {
    var that = this;
    util.postJSON({
      apiUrl: apiurl.goodsCart_update,
      data: {
        sku_id: sku_id,
        count: count
      }
    }, function (res) {
      // that.goodsCart()
      if (suc) {
        suc()
      }
    }, function (res) {

    }, function (res) {

    })
  },
  choosecar(e) {
    var choosecar = this.data.choosecar
    var allchoosecar = this.data.allchoosecar
    var carmoney = this.data.carmoney
    var sku_id = e.currentTarget.dataset.sku_id
    var price = e.currentTarget.dataset.price
    var count = e.currentTarget.dataset.count
    var listnum = e.currentTarget.dataset.listnum
    var all = 1
    if (choosecar.sku_id[listnum].indexOf(sku_id) > -1) {
      var num = choosecar.sku_id[listnum].indexOf(sku_id)
      choosecar.sku_id[listnum].splice(num, 1);
      choosecar.price[listnum].splice(num, 1);
      choosecar.count[listnum].splice(num, 1);
    } else {
      choosecar.sku_id[listnum].push(e.currentTarget.dataset.sku_id)
      choosecar.price[listnum].push(e.currentTarget.dataset.price)
      choosecar.count[listnum].push(e.currentTarget.dataset.count)
    }
    for (var i in choosecar.sku_id) {
      if (choosecar.sku_id[i].length != allchoosecar.sku_id[i].length) {
        all = 0
      }
    }
    this.setData({
      choosecar: choosecar,
      all: all
    })
    this.carmoney()
  },
  carmoney() {
    var choosecar = this.data.choosecar;
    var carmoney = 0
    for (var i in choosecar.sku_id) {
      for (var j in choosecar.sku_id[i]) {
        carmoney = carmoney + choosecar.price[i][j] * choosecar.count[i][j]
      }
    }
    this.setData({
      carmoney: carmoney
    })
  },
  allchoosecar() {
    var all = this.data.all,
      allchoosecar = {
        sku_id: [],
        count: [],
        price: []
      },
      choosecar = {
        sku_id: [],
        count: [],
        price: []
      }
    if (!this.data.all) {
      allchoosecar = this.data.allchoosecar
      for (var i in allchoosecar.sku_id) {
        choosecar.sku_id[i] = []
        choosecar.price[i] = []
        choosecar.count[i] = []
        for (var j in allchoosecar.sku_id[i]) {
          choosecar.sku_id[i].push(allchoosecar.sku_id[i][j])
          choosecar.price[i].push(allchoosecar.price[i][j])
          choosecar.count[i].push(allchoosecar.count[i][j])
        }
      }
    } else {
      allchoosecar = this.data.allchoosecar
      for (var a in allchoosecar.sku_id) {
        choosecar.sku_id[a] = []
        choosecar.price[a] = []
        choosecar.count[a] = []

      }
    }
    console.log(choosecar)
    this.setData({
      choosecar: choosecar,
      all: !all
    })
    this.carmoney()
  },
  carview() {
    this.goodsCart()
    this.setData({
      visiblec: true
    })
  },
  onClosec() {
    this.setData({
      visiblec: false
    })
  },
  addshopcar() {
    this.setData({
      visible1: true,
      addshopcarnum: 1
    })
  },
  appshop(e) {
    var that = this;
    for (var i in that.data.choosed) {
      if (that.data.choosed[i].indexOf("u") != -1) {
        return util.alert("请选择" + that.data.result.specs[i]["spec_name"])
      }
    }
    var data = {
      sku_id: that.data.result.sku_id,
      count: that.data.count
    }
    that.setData({
      buyok: true
    })
    util.postJSON({
      apiUrl: apiurl.goodsCart_update,
      data: data
    }, function (res) {
      var result = res.data.result
      console.log(res)
      that.setData({
        buyok: false,
        visible1: false,
        addshopcarnum: 0
      })
      that.goodsCart()
    }, function (res) {
      that.setData({
        buyok: false
      })
    }, function (res) {
      that.setData({
        buyok: false
      })
    })
  },
  settlement(e) {
    var that = this,
      choosecar = this.data.choosecar,
      num = 0;
    var data = {
      buy_type: "cart",
    }
    for (var i in choosecar.sku_id) {
      for (var j in choosecar.sku_id[i]) {

        data['sku_arr[' + num + '][sku_id]'] = choosecar.sku_id[i][j]
        data['sku_arr[' + num + '][count]'] = choosecar.count[i][j]
        num = num + 1
      }
    }
    if (num < 1) {
      return util.alert("请选择下单商品")
    }
    that.setData({
      visiblec: false
    })
    console.log(data)
    util.postJSON({
      apiUrl: apiurl.order_payShow,
      data: data
    }, function (res) {
      var result = res.data.result
      getApp().globalData.order_detail = result
      wx.navigateTo({
        url: '../order_detail/index',
      })
    })
  },
  onShareAppMessage: function () {
    var pjdata = {
      id: this.data.sku_id
    }
    return util.share('啄木鸟环保', '../agriculturalDetail/index&pjdata=' + JSON.stringify(pjdata))
    // return util.share('啄木鸟环保', '/pages/agriculturalDetail/index?id=' + this.data.sku_id + "&pjurl='../agriculturalDetail/index?id='" + this.data.sku_id)
  }
})