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
    // var list =[
    //   {
    //     shop_id:"20",
    //     source:"online",
    //     thumb:"https://wyhb-res-pr.zgwyhb.com/uploads/image/2019/03/22/00c0403f010e3430d94fdebe75cf9b84.jpg",
    //     title:"测试店铺",
    //     contact:"18583750250",
    //     goods_arr:[
    //       {
    //         count:"2",
    //         price:"12.00",
    //         sku_id:"12",
    //         sku_name:"黑色-A",
    //         spu_id:"12",
    //         spu_name:"测试商品",
    //         thumb:"https://wyhb-res-pr.zgwyhb.com/uploads/image/2019/03/13/789e2b0b3f3420575b4113ea58f98bcf.jpg"
    //       },
    //       {
    //         count: "3",
    //         price: "13.00",
    //         sku_id: "13",
    //         sku_name: "黑色-A",
    //         spu_id: "12",
    //         spu_name: "测试商品",
    //         thumb: "https://wyhb-res-pr.zgwyhb.com/uploads/image/2019/03/13/789e2b0b3f3420575b4113ea58f98bcf.jpg"
    //       },
    //       {
    //         count: "4",
    //         price: "14.00",
    //         sku_id: "14",
    //         sku_name: "黑色-A",
    //         spu_id: "13",
    //         spu_name: "测试商品",
    //         thumb: "https://wyhb-res-pr.zgwyhb.com/uploads/image/2019/03/13/789e2b0b3f3420575b4113ea58f98bcf.jpg"
    //       }
    //     ]
    //   },
    //   {
    //     shop_id: "20",
    //     source: "online",
    //     thumb: "https://wyhb-res-pr.zgwyhb.com/uploads/image/2019/03/22/00c0403f010e3430d94fdebe75cf9b84.jpg",
    //     title: "测试店铺",
    //     contact: "18583750250",
    //     goods_arr: [
    //       {
    //         count: "2",
    //         price: "12.00",
    //         sku_id: "12",
    //         sku_name: "黑色-A",
    //         spu_id: "12",
    //         spu_name: "测试商品",
    //         thumb: "https://wyhb-res-pr.zgwyhb.com/uploads/image/2019/03/13/789e2b0b3f3420575b4113ea58f98bcf.jpg"
    //       },
    //       {
    //         count: "3",
    //         price: "13.00",
    //         sku_id: "13",
    //         sku_name: "黑色-A",
    //         spu_id: "12",
    //         spu_name: "测试商品",
    //         thumb: "https://wyhb-res-pr.zgwyhb.com/uploads/image/2019/03/13/789e2b0b3f3420575b4113ea58f98bcf.jpg"
    //       },
    //       {
    //         count: "4",
    //         price: "14.00",
    //         sku_id: "14",
    //         sku_name: "黑色-A",
    //         spu_id: "13",
    //         spu_name: "测试商品",
    //         thumb: "https://wyhb-res-pr.zgwyhb.com/uploads/image/2019/03/13/789e2b0b3f3420575b4113ea58f98bcf.jpg"
    //       }
    //     ]
    //   }
    // ]
    // var allchoosecar = { sku_id: [], price: [], count: [], }, choosecar = { sku_id: [], price: [], count: [], }
    // for (var i in list) {
    //   allchoosecar.sku_id[i]=[]
    //   allchoosecar.price[i] = []
    //   allchoosecar.count[i] = []
    //   choosecar.sku_id[i] = []
    //   choosecar.price[i] = []
    //   choosecar.count[i] = []
    //   for (var j in list[i]["goods_arr"]) {
    //     allchoosecar.sku_id[i].push(list[i]["goods_arr"][j].sku_id)
    //     allchoosecar.price[i].push(list[i]["goods_arr"][j].price)
    //     allchoosecar.count[i].push(list[i]["goods_arr"][j].count)
    //   }
    // }
    // this.setData({
    //   list: list,
    //   allchoosecar: allchoosecar,
    //   choosecar: choosecar
    // })
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
      var result = res.data.result, allchoosecar = { sku_id: [], price: [], count: [], }, choosecar = { sku_id: [], price: [], count: [], }
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
        list: list,
        allchoosecar: allchoosecar,
        choosecar: choosecar
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
    var listnum = e.currentTarget.dataset.listnum
    var all = 1
    console.log(choosecar)
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
    for (var i in choosecar.sku_id){
      if (choosecar.sku_id[i].length != allchoosecar.sku_id[i].length){
        all = 0
      }
    }
    this.setData({
      choosecar: choosecar,
      all: all
    })
    this.carmoney()
  },
  choosecard(e){
    var listnum = e.currentTarget.dataset.listnum
    var choosecar = this.data.choosecar
    var allchoosecar = this.data.allchoosecar, all = 1
    if (choosecar.sku_id[listnum].length == allchoosecar.sku_id[listnum].length) {
      choosecar.sku_id[listnum]=[]
      
      console.log(choosecar.sku_id[listnum])
    } else {
      choosecar.sku_id[listnum] = []
      for (var i in allchoosecar.sku_id[listnum]) {
        choosecar.sku_id[listnum][i] = allchoosecar.sku_id[listnum][i]
        choosecar.price[listnum][i] = allchoosecar.price[listnum][i]
        choosecar.count[listnum][i] = allchoosecar.count[listnum][i]
      }
      console.log(choosecar.sku_id[listnum])
    }
    for (var a in choosecar.sku_id) {
      if (choosecar.sku_id[a].length != allchoosecar.sku_id[a].length) {
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
      for (var j in choosecar.sku_id[i]){
        carmoney = carmoney + choosecar.price[i][j] * choosecar.count[i][j]
      }
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
      // for (var i in ) {
      //   choosecar.sku_id.push(allchoosecar.sku_id[i])
      //   choosecar.price.push(allchoosecar.price[i])
      //   choosecar.count.push(allchoosecar.count[i])
      // }
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
    }
    this.setData({
      choosecar: choosecar,
      all: !all
    })
    this.carmoney()
  },
  choosecardel(){
    var that = this;
    var data = {}, choosecar = this.data.choosecar,num=0
    for (var i in choosecar.sku_id){
      for (var j in choosecar.sku_id[i]){
        num=num+1
        data['sku_id[' + num + ']'] = choosecar.sku_id[i][j]
      }
    }
    util.postJSON({ apiUrl: apiurl.goodsCart_del,data:data }, function (res) {
      util.alert(res.data.message)
      that.goodsCart()
    })
  },
  settlement(e) {
    var that = this, choosecar = this.data.choosecar,num=0;
    var data = {
      buy_type: "cart",
    }

    for (var i in choosecar.sku_id) {
      for(var j in choosecar.sku_id[i]){
        num = num+1
        data['sku_arr[' + num + '][sku_id]'] = choosecar.sku_id[i][j]
      }
    }
    that.setData({
      visiblec: false
    })
    console.log(data)
    util.postJSON({ apiUrl: apiurl.order_payShow, data: data }, function (res) {
      var result = res.data.result
      wx.navigateTo({
        url: '../order_detail/index?result=' + JSON.stringify(result),
      })
    })
  },
})