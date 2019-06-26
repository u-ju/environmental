// pages/myCart/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
var lastTime = new Date().getTime()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    choosecar: { sku_id: [], count: [], price: [] },
    allchoosecar: { sku_id: [], count: [], price: [] },
    carmoney: 0,
    all: 0,
    addshopcarnum: 0,
    list:[0]
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
    //     goods_arr: [z
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
      console.log(choosecar)
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
  bindcz(e){
    var symbols = e.currentTarget.dataset.symbols, num = e.currentTarget.dataset.num, index = e.currentTarget.dataset.index, listnum = e.currentTarget.dataset.listnum, list = this.data.list, sku_id = e.currentTarget.dataset.sku_id;
    var that = this;
    var skuID_last = this.data.skuID_last || e.currentTarget.dataset.sku_id, num_last = that.data.num_last;
    var choosecar = that.data.choosecar, allchoosecar = that.data.allchoosecar;
    if (symbols=='add'){
      num++
    }else{
      num--
    }
    list[listnum]["goods_arr"][index]["count"] = num
    
    if (skuID_last != sku_id) {
      console.log(skuID_last, num_last)
      that.updatacar(skuID_last, num_last, listnum);
    }
    allchoosecar.count[listnum][allchoosecar.sku_id[listnum].indexOf(sku_id)] = num
    
    that.setData({
      list: list,
      allchoosecar: allchoosecar,
      skuID_last: sku_id,
      num_last: num
    })
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
 
  
  updatacar(sku_id, count, listnum, suc) {
    var that = this;
    util.postJSON({ apiUrl: apiurl.goodsCart_update, data: { sku_id: sku_id, count: count } }, function (res) {
      // that.goodsCart()
      if(suc){
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
      
    } else {
      choosecar.sku_id[listnum] = []
      for (var i in allchoosecar.sku_id[listnum]) {
        choosecar.sku_id[listnum][i] = allchoosecar.sku_id[listnum][i]
        choosecar.price[listnum][i] = allchoosecar.price[listnum][i]
        choosecar.count[listnum][i] = allchoosecar.count[listnum][i]
      }
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
    }else{
      allchoosecar = this.data.allchoosecar
      for (var a in allchoosecar.sku_id) {
        choosecar.sku_id[a] = []
        choosecar.price[a] = []
        choosecar.count[a] = []
       
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
    console.log(num)
    if (num<1) {
      return util.alert('请选择删除内容')
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
    util.postJSON({ apiUrl: apiurl.order_payShow, data: data }, function (res) {
      var result = res.data.result
      getApp().globalData.order_detail = result
      wx.navigateTo({
        url: '../order_detail/index',
      })
    })
  },
})