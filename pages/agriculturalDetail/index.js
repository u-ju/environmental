// pages/agriculturalDetail/index.js
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
    beforeColor: "white",//指示点颜色
    afterColor: "coral",//当前选中的指示点颜色
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
    
    cartArr: [
      { name: '1', value: '已阅读分期协议' },
    ],
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
    tab: ['产品', '评论','详情'],
    active:0
  },
  tabswitch(e){
    this.setData({
      active: e.currentTarget.dataset.index,
      toView: 'view' + e.currentTarget.dataset.index
    })
  },
  scroll(e) {
    var top = this.data.top
    for (var i = 0; i < top.length; i++) {
      if (top[i] < e.detail.scrollTop + 44) {
        this.setData({
          active: i,
        })
      }
    }
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
    // options.id =9
    that.setData({
      sku_id: options.id,
      s_height: wx.getSystemInfoSync().windowHeight - 42,
    })
    that.goods(options.id)
    var top =[]
    wx.createSelectorQuery().selectAll('.view0').boundingClientRect(function (rect) {
      console.log(rect)
      top.push(rect[0]['top'])
    }).exec()
    wx.createSelectorQuery().selectAll('.view1').boundingClientRect(function (rect) {
      console.log(rect)
      top.push(rect[0]['top'])
    }).exec()
    wx.createSelectorQuery().selectAll('.view2').boundingClientRect(function (rect) {
      console.log(rect)
      top.push(rect[0]['top'])
      that.setData({
        top: top
      })
    }).exec()
  },
  goods(id) {
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
          } else if (result.sku_key.indexOf('-') == -1) {
            arr[b].push(spec_values[a].sku_key[2])
          }
        }
      }
      that.setData({
        result: result,
        choosed: choosed,
        spu_id: result.spu_id,
        arr: arr
      })

      that.commentIndex(result.spu_id)
      // that._click(choosed, result.spec_values, result,1)
      util.hideLoading()
    })
  },
  commentIndex(spu_id, page = 1) {
    var that = this;
    util.getJSON({ apiUrl: apiurl.goods_commentIndex + spu_id + "&page=" + page }, function (res) {
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
    var arr = [], that = this;
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
  choosespecs(e) {
    if (e.currentTarget.dataset.click == -1) {
      return false
    }
    var choosed = this.data.choosed;
    for (var i in choosed) {
      if (choosed[i][0] == e.currentTarget.dataset.spec_id) {
        var a = choosed[i];
        a = a.split('')   //将a字符串转换成数组
        if (choosed[i][2] == e.currentTarget.dataset.spec_value_id) {
          a.splice(2, 1, 'u')
        } else {
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
  buy(e) {
    var that = this;
    for (var i in that.data.choosed) {
      if (that.data.choosed[i].indexOf("u") != -1) {
        return util.alert("请选择" + that.data.result.specs[i]["spec_name"])
      }
    }
    var data = {
      buy_type: "now",
      'sku_arr[0][sku_id]': that.data.result.sku_id,
      'sku_arr[0][count]': that.data.count
    }
    that.setData({
      buyok: true
    })

    util.postJSON({ apiUrl: apiurl.order_payShow, data: data }, function (res) {
      var result = res.data.result
      wx.navigateTo({
        url: '../order_detail/index?result=' + JSON.stringify(result),
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
  }
  
})