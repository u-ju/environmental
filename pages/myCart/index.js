// pages/myCart/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    choosecar: { sku_id: [], count: [], price: [] },
    allchoosecar: { sku_id: [], count: [], price: [] },
    carmoney: 0,
    all: 0,
    addshopcarnum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.goodsCart()
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

  goodsCart() {
    var that = this;
    util.getJSON({ apiUrl: apiurl.goodsCart_index }, function (res) {
      var list = res.data.result.list
      var result = res.data.result, allchoosecar = { sku_id: [], price: [], count: [], }
      for (var i in list) {
        for (var j in list[i]["goods_arr"]) {
          allchoosecar.sku_id.push(list[i]["goods_arr"][j].sku_id)
          allchoosecar.price.push(list[i]["goods_arr"][j].price)
          allchoosecar.count.push(list[i]["goods_arr"][j].count)
        }
      }
      that.setData({
        list: list,
        allchoosecar: allchoosecar
      })
      util.hideLoading()
    })
  },
  //购物车事件处理函数
  /*点击减号*/
  bindMinus: function (e) {
    var num = e.currentTarget.dataset.num;
    console.log(e.currentTarget.dataset.num)
    if (num > 0) {
      num--;
    } else {
      return
    }
    this.updatacar(e.currentTarget.dataset.sku_id, num)
  },
  /*点击加号*/
  bindPlus: function (e) {
    var num = e.currentTarget.dataset.num;
    num++;
    console.log(num)
    this.updatacar(e.currentTarget.dataset.sku_id, num)

  },
  updatacar(sku_id, count, suc) {
    var that = this;
    util.postJSON({ apiUrl: apiurl.goodsCart_update, data: { sku_id: sku_id, count: count } }, function (res) {
      that.goodsCart()
      var choosecar = that.data.choosecar;
      console.log(choosecar)
      if (choosecar.sku_id.indexOf(sku_id) > -1) {
        console.log(choosecar)
        choosecar.count[choosecar.sku_id.indexOf(sku_id)] = count
        that.setData({
          choosecar: choosecar
        })
        that.carmoney()
      }
    }, function (res) {

    }, function (res) {

    })
  },
  choosecar(e) {
    // console.log(e)
    var choosecar = this.data.choosecar
    var allchoosecar = this.data.allchoosecar
    var carmoney = this.data.carmoney
    var sku_id = e.currentTarget.dataset.sku_id
    var price = e.currentTarget.dataset.price
    var count = e.currentTarget.dataset.count
    var all = this.data.all
    console.log(choosecar)
    if (choosecar.sku_id.indexOf(sku_id) > -1) {
      var num = choosecar.sku_id.indexOf(sku_id)
      choosecar.sku_id.splice(num, 1);
      choosecar.price.splice(num, 1);
      choosecar.count.splice(num, 1);
    } else {
      choosecar.sku_id.push(e.currentTarget.dataset.sku_id)
      choosecar.price.push(e.currentTarget.dataset.price)
      choosecar.count.push(e.currentTarget.dataset.count)
    }
    if (choosecar.sku_id.length == allchoosecar.sku_id.length) {
      all = 1
    } else {
      all = 0
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
      carmoney = carmoney + choosecar.price[i] * choosecar.count[i]
    }
    // console.log(choosecar)
    this.setData({
      carmoney: carmoney
    })
  },
  allchoosecar() {
    var all = this.data.all, allchoosecar = { sku_id: [], count: [], price: [] }, choosecar = { sku_id: [], count: [], price: [] }
    if (!this.data.all) {
      allchoosecar = this.data.allchoosecar
      for (var i in allchoosecar.sku_id) {
        choosecar.sku_id.push(allchoosecar.sku_id[i])
        choosecar.price.push(allchoosecar.price[i])
        choosecar.count.push(allchoosecar.count[i])
      }

    }
    this.setData({
      choosecar: choosecar,
      all: !all
    })
    this.carmoney()
  },
})