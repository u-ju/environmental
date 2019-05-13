// pages/installment_details/installment_details.js

// 评论列表 选择规格
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,//显示面板指示点
    autoplay: true,//自动播放
    beforeColor: "#DCDCDC",//指示点颜色
    afterColor: "#27AAD9",//当前选中的指示点颜色
    interval: 5000,
    duration: 1000,
    banner: [
      { image: '../../images/catering_test.png' },
      { image: '../../images/catering_test.png' },
      { image: '../../images/catering_test.png' },
    ],
    result: "",
    visible1: false,
    visible2: false,
    visible3: false,
    cc:[
      { id: 1, title: '6.1寸' },
      { id: 2, title: '6.2寸' },
      { id: 3, title: '6.3寸' },
      { id: 4, title: '6.4寸' },
      { id: 5, title: '6.5寸' },
      { id: 6, title: '6.6寸' },
      { id: 7, title: '6.7寸' },
      { id: 8, title: '6.8寸' },
    ],
    ys:[
      { id: 1, title: '贝壳' },
      { id: 2, title: '桃心' },
      { id: 3, title: '横纹' },
      { id: 4, title: '球形' },
      { id: 5, title: '小鱼' },
      { id: 6, title: '大海' },
    ],
    items: [
      { name: '1', value: '不分期，市场价购买', choose: 0 },
      { name: '2', value: '￥206.51 X 2期', intr: '含服务费：每期￥6.02，费率0.80%', choose: 0 },
      // { name: '3', value: '￥110.25 X 4期', intr: '含服务费：每期￥6.02，费率0.80%', checked: 'true' },
    ],
    cartArr:[
      { name: '1', value: '已阅读分期协议' },
    ],
    current:0,
    list:[],
    result:{},
    page: {},
    choosespec:[],
    specifications:[],
    disable:false,
    count:1,
    buyok:false,
    commentIndex:1,
    list1:[],
    chooseqx: [
      { name: 1, value: '全选', checked: true },
    ],
    choose: ['1'],
    visiblec: false,
    choosecar: { sku_id: [], count: [], price:[]},
    allchoosecar: { sku_id: [], count: [], price: [] },
    carmoney:0,
    all:0,
    addshopcarnum:0
  },
  swiper(e){
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
  link(e){
    wx.navigateTo({
      url: '../page/index?url=' + e.currentTarget.dataset.url,
    })
  },
  fqtz(){
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
    // options.id=12
    that.setData({
      sku_id: options.id
    })
    that.goods(options.id)
    that.goodsCart()
  },
  goods(id){
    var that = this;
    util.getJSON({ apiUrl: apiurl.goods_show + id }, function (res) {
      var result = res.data.result
      var choosed = [result.sku_key]
      var choosedkey = result.sku_key, arr = [], spec_values = res.data.result.spec_values
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
          } else if (result.sku_key.indexOf('-') == -1){
            arr[b].push(spec_values[a].sku_key[2])
          }
        }
      }
      that.setData({
        result: result,
        choosed: choosed,
        spu_id: result.spu_id,
        arr: arr,
        comment_score: Math.ceil(result.comment_score)
      })
      
      that.commentIndex(result.spu_id)
      // that._click(choosed, result.spec_values, result,1)
      util.hideLoading()
    })
  },
  goodsCart() {
    var that = this;
    util.getJSON({ apiUrl: apiurl.goodsCart_index}, function (res) {
      var list =  res.data.result.list
      var result = res.data.result, allchoosecar = { sku_id: [], price: [], count: [],}
      for(var i in list){
        for (var j in list[i]["goods_arr"]){
          allchoosecar.sku_id.push(list[i]["goods_arr"][j].sku_id)
          allchoosecar.price.push(list[i]["goods_arr"][j].price)
          allchoosecar.count.push(list[i]["goods_arr"][j].count)
        }
      }
      that.setData({
        goodsCart: list,
        count: res.data.result.count,
        allchoosecar: allchoosecar
      })
      util.hideLoading()
    })
  },
  commentIndex(spu_id, page=1){
    var that = this;
    util.getJSON({ apiUrl: apiurl.goods_commentIndex + spu_id+"&page="+page }, function (res) {
      var list = res.data.result.list
      var result = res.data.result
      var list1=[]
      for (var i in list){
        list[i].created_at = list[i].created_at.split(" ")[0]
      }
      if (list.length>0){
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
  _click(choosed, spec_values = this.data.result.spec_values, result = this.data.result,init){
    // var disable = false
    var arr = [],that = this;
    for (var n in choosed) {
      arr[n] = [];
    }
    var choosedkey =choosed.join('-')
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
    
    
    
    if (choosedkey.indexOf('u')>-1){
// 未完全勾选时
      var num=0
      // 部分未勾选时
      for (var m in choosed) {
        if (choosed[m][2] != 'u')  {
          for (var a in spec_values) {
            if (arr[m].indexOf(spec_values[a].sku_key.split("-")[m][2]) == -1) {
              arr[m].push(spec_values[a].sku_key.split("-")[m][2])
            }
          }
        }else{
          num=num+1
        }
      }
      // 全部未勾选时
      if (num == choosed.length){
        for (var p in choosed) {
          for (var q in spec_values) {
            if (arr[p].indexOf(spec_values[q].sku_key.split("-")) == -1) {
              arr[p].push(spec_values[q].sku_key.split("-")[p][2])
            }
          }
        }
      }
    }else{
      for (var u in spec_values){
        if (choosedkey == spec_values[u]['sku_key'] && result.sku_id != spec_values[u]['sku_id']){
          
         return that.goods(spec_values[u]['sku_id'])
        }
      }
    }
    
    
    that.setData({
      arr: arr,
      result: result
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
  choosespecs(e){
    if (e.currentTarget.dataset.click==-1){
      return false
    }
    var choosed = this.data.choosed;
    for (var i in choosed){
      if (choosed[i][0] == e.currentTarget.dataset.spec_id){
        var a = choosed[i];
        a = a.split('')   //将a字符串转换成数组
        if (choosed[i][2] == e.currentTarget.dataset.spec_value_id){
          a.splice(2, 1, 'u') 
        }else{
          a.splice(2, 1, e.currentTarget.dataset.spec_value_id)
        }
        
        choosed[i] = a.join('')
      }
    }
    // if (choosed[e.currentTarget.dataset.choosed] == e.currentTarget.dataset.spec_value_id){
    //   choosed[e.currentTarget.dataset.choosed]=-1
    // }else{
    //   choosed[e.currentTarget.dataset.choosed] = e.currentTarget.dataset.spec_value_id
    // }
    this.setData({
      choosed: choosed
    })
    this._click(choosed)
  },
  buy(e){
    var that = this;
    for (var i in that.data.choosed){
      if (that.data.choosed[i].indexOf("u") != -1){
        return util.alert("请选择" + that.data.result.specs[i]["spec_name"])
      }
    }
    var data ={
      buy_type:"now",
      'sku_arr[0][sku_id]': that.data.result.sku_id,
      'sku_arr[0][count]': that.data.count
    }
    that.setData({
      buyok: true
    })
    
    util.postJSON({ apiUrl: apiurl.order_payShow,data:data }, function (res) {
      var result = res.data.result
        wx.navigateTo({
          url: '../order_detail/index?result='+ JSON.stringify(result),
      })
      that.setData({
        buyok: false,
        visible1:false
      })
      // that.setData({
      //   buyok: false
      // })
    },function(res){
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
  more(){
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
      mask:true
    })
    if (this.data.commentIndex==1){
      wx.hideLoading()
      return this.setData({
        commentIndex:0
      })
    }
    
    // 页数+1
    if (Number(that.data.page.current_page) != Number(that.data.page.last_page)) {
      that.commentIndex(that.spu_id,Number(that.data.page.current_page) + 1)
    } else {
      that.setData({
        last: true
      })
      setTimeout(function(){
        wx.hideLoading()
      },1000)
    }
  },
  contact(e){
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
  bindMinus: function (e) {
    var num = e.currentTarget.dataset.num;
    console.log(e.currentTarget.dataset.num)
    if (num > 0) {
      num--;
    }else{
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
  /*输入框事件*/
  bindManual: function (e) {
    var num = e.detail.value;

  },
  goodsCartclear(){
    var that = this;
    util.postJSON({ apiUrl: apiurl.goodsCart_clear }, function (res) {
      util.alert(res.data.message)
      that.goodsCart()
    })
  },
  updatacar(sku_id, count,suc){
    var that = this;
    util.postJSON({ apiUrl: apiurl.goodsCart_update, data: { sku_id: sku_id, count: count} }, function (res) {
      that.goodsCart()
      var choosecar = that.data.choosecar;
      console.log(choosecar)
      if (choosecar.sku_id.indexOf(sku_id)>-1){
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
  choosecar(e){
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
    if (choosecar.sku_id.length == allchoosecar.sku_id.length){
      all=1
    }else{
      all=0
    }
    this.setData({
      choosecar: choosecar,
      all: all
    })
    this.carmoney()
  },
  carmoney(){
    var choosecar = this.data.choosecar;
    var carmoney =0
    for (var i in choosecar.sku_id){
      carmoney = carmoney + choosecar.price[i] * choosecar.count[i]
    }
    // console.log(choosecar)
    this.setData({
      carmoney: carmoney
    })
  },
  allchoosecar(){
    var all = this.data.all, allchoosecar = { sku_id: [], count: [], price: [] }, choosecar = { sku_id: [], count: [], price: [] }
    if (!this.data.all){
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
  carview(){
    this.goodsCart()
    this.setData({
      visiblec:true
    })
  },
  onClosec(){
    this.setData({
      visiblec: false
    })
  },
  addshopcar(){
    this.setData({
      visible1:true,
      addshopcarnum:1
    })
  },
  appshop(e){
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
    util.postJSON({ apiUrl: apiurl.goodsCart_update, data: data }, function (res) {
      var result = res.data.result
      console.log(res)
      that.setData({
        buyok: false,
        visible1: false,
        addshopcarnum:0
      }, function (res) {
        that.setData({
          buyok: false
        })
      }, function (res) {
        that.setData({
          buyok: false
        })
      })
    })
  },
  settlement(e) {
    var that = this, choosecar = this.data.choosecar;
    var data = {
      buy_type: "cart",
    }
    for (var i in choosecar.sku_id){
      data['sku_arr['+i+'][sku_id]'] = choosecar.sku_id[i]
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
  // onPullDownRefresh: function () {
  //   // 显示顶部刷新图标
  //   wx.showNavigationBarLoading();

  //   var that = this;
  //   util.getJSON({  apiUrl: apiurl.goods_commentIndex + that.spu_id + "&page=" + page}, function (res) {
  //     var result = res.data.result
  //     var list = result.list
  //     that.setData({
  //       list: list,
  //       page: result.page,
  //       last: false,
  //     })
  //     // 隐藏导航栏加载框
  //     wx.hideNavigationBarLoading();
  //     // 停止下拉动作
  //     wx.stopPullDownRefresh();
  //     util.hideLoading()
  //   })
  // },

  // /**
  //  * 页面上拉触底事件的处理函数
  //  */
  // onReachBottom: function () {
  //   var that = this;
  //   // 显示加载图标
  //   wx.showLoading({
  //     title: '玩命加载中',
  //   })
  //   // 页数+1
  //   if (Number(that.data.page.current_page) != Number(that.data.page.last_page)) {
  //     that.commentIndex(that.spu_id,Number(that.data.page.current_page) + 1)
  //   } else {
  //     that.setData({
  //       last: true
  //     })
  //     wx.hideLoading()
  //   }
  // },
})