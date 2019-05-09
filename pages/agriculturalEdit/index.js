// pages/agriculturalEdit/index.js
const app = getApp()
var util = require('../../utils/util.js');
var apiurl = require('../../utils/api.js');
var Promise = require('../../utils/es6-promise.js');
// 颜色：黑色，白色，红色；版本：A，B
Page({
  data: {
    // show: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: ['1', '2', '3', '4', '5', '6'],//下拉列表的数据
    index: 0,//选择的下拉列表下标
    spu_intro:[],
    isHidePlaceholder: false,
    value1: [],
    visible1:false,
    
    spec_group_arr: [],
    skunum:1,
    show: [false],
    key_name:[],
    key:[],
    thumb:[[]],
    images: [[]],
    price:[],
    stock:[],
    url:'shop_goodsStore',
    spu_id:'',
    del:[],
    add:[],
    edit:[],
    post:false
  },
  addsku(){
    var thumb = this.data.thumb
    var images = this.data.images
    var key_name = this.data.key_name
    var key = this.data.key
    thumb.push([])
    images.push([])
    key_name.push('')
    key.push('')
    this.setData({
      skunum: this.data.skunum+1,
      images: images,
      thumb: thumb,
      key_name: key_name,
      key: key
    })
  },
  delsku(e){
    var index = e.currentTarget.dataset.index;
    this.setData({
      skunum: this.data.skunum - 1,
    })
    var thumb = this.data.thumb.splice(index, 1)
    var images = this.data.images.splice(index, 1)
    var key_name = this.data.key_name.splice(index, 1)
    var key = this.data.key.splice(index, 1)
    var del = this.data.del
    console.log(this.data.key)
    if (e.currentTarget.dataset.key && del.indexOf(e.currentTarget.dataset.key)){
      del = del.push(e.currentTarget.dataset.key)
    }
    console.log(this.data.key)
    this.setData({
      // thumb: thumb,
      // images: images,
      // key_name: key_name,
      // key: key,
      del: del
    })
    console.log(this.data.key)
    console.log(this.data.skunum)
  },
  // textarea 输入时触发
  getTextareaInput: function (e) {
    var that = this;
    if (e.detail.cursor > 0) {
      that.setData({
        isHidePlaceholder: true
      })
    } else {
      that.setData({
        isHidePlaceholder: false
      })
    }
  }, 
  goodsSpecFormat(e){
    if (e.detail.value.length<1){
      return
    }
    var value = encodeURI(e.detail.value)
    
    console.log(value)
    this.goodsSpecFormat1(value)
  },
  goodsSpecFormat1(value) {
    var that = this;
    util.getJSON({ apiUrl: apiurl.shop_goodsSpecFormat + value }, function (res) {
      that.setData({
        spec_group_arr: res.data.result.spec_group_arr
      })
    })
  },
  // 上下架
  goodsUpDown(){
    var that = this;
    util.postJSON({ apiUrl: apiurl.shop_goodsUpDown, data: { shop_id: that.data.shop_id, spu_id: that.data.spu_id} }, function (res) {
      util.alert(res.data.message)
      that.setData({
        status:!that.data.status
      })
    })
  },
  // 点击下拉显示框
  selectTap(e) {
    console.log(e.currentTarget.dataset.index)
    console.log(this.data.key)
    var show = this.data.show
    show[e.currentTarget.dataset.index] = !show[e.currentTarget.dataset.index]
    this.setData({
      show: show
    });
  },

  // 点击下拉列表
  optionTap(e) {
    let name = e.currentTarget.dataset.name;
    let keyv = e.currentTarget.dataset.key;
    var key_name = this.data.key_name;
    var key = this.data.key;
    var add = this.data.add
    for (var i in key){
      if (key[i] == e.currentTarget.dataset.key){
        return util.alert("已有改规格，请重新选择")
      }else{
        if (add.indexOf(e.currentTarget.dataset.key)){
          add.push(e.currentTarget.dataset.key)
        }
        console.log(add)
      }
    }
    key_name[e.currentTarget.dataset.indexnum] = name
    key[e.currentTarget.dataset.indexnum] = keyv
    var show = this.data.show
    show[e.currentTarget.dataset.indexnum] = !show[e.currentTarget.dataset.indexnum]
    this.setData({
      key_name: key_name,
      key: key,
      show: show,
      add: add
    });
  },
  init(){
    var that = this;
    util.getJSON({ apiUrl: apiurl.shop_goodsShowOwn + '?shop_id=' + that.data.shop_id + '&spu_id=' + that.data.spu_id }, function (res) {
      var result = res.data.result, key = [], key_name = [], price = [], stock = [], thumb = [], images = [], edit=[]
      for (var i in result.skus){
        edit[i] = result.skus[i]['sku_key']
        key[i] = result.skus[i]['sku_key']
        key_name[i] = result.skus[i]['sku_name']
        price[i] = result.skus[i]['price']
        stock[i] = result.skus[i]['stock']
        
        images[i]=[]
        for (var j in result.skus[i]['images']){
          console.log(result.skus[i]['images'][j])
          images[i].push({ upload_percent: 100, path_server: result.skus[i]['images'][j] })
        }
        if (result.skus[i]['thumb'] ){
          thumb[i] = [{ upload_percent: 100, path_server: result.skus[i]['thumb'] }]
        }else{
          thumb[i]=[]
        }
        console.log(thumb)
      }
      var spu_intro = []
      if (result.spu_intro){
        spu_intro = [{ upload_percent: 100, path_server: result.spu_intro }]
      }
      console.log(result)
      that.setData({
        spec_str: result.spec_str,
        cate_id: result.cate_id,
        title1: result.cate_name,
        spu_name: result.spu_name,
        spu_intro: spu_intro,
        key: key,
        key_name: key_name,
        price: price,
        stock: stock,
        thumb: thumb,
        status: result.status,
        images: images,
        skunum: result.skus.length,
        isHidePlaceholder:true,
        url:'shop_goodsUpdate'
      })
      that.goodsSpecFormat1(result.spec_str)
      // { upload_percent: 100, path_server: '' }
      
      util.hideLoading()
    })
  },
  onLoad: function (options) {
    // 
    var goods_cate = app.globalData.config.goods_cate
    for (var i in goods_cate){
      goods_cate[i]["value"] = goods_cate[i]["id"]
      goods_cate[i]["label"] = goods_cate[i]["name"]
      for (var j in goods_cate[i]["children"]){
        goods_cate[i]["children"][j]["value"] = goods_cate[i]["children"][j]["id"]
        goods_cate[i]["children"][j]["label"] = goods_cate[i]["children"][j]["name"]
      }
    }
    // options.spu_id=12
    // options.id=20
    this.setData({
      goods_cate: goods_cate,
      shop_id: options.id
    })

    if (options.spu_id){
      this.setData({
        spu_id: options.spu_id
      })
      this.init()
    }
  },
  // 商品类型
  onOpen1() {
    
    this.setData({ visible1: true })
  },
  onClose1() {
    this.setData({ visible1: false })
  },
  onChange1(e) {
    this.setData({ title1: e.detail.options.map((n) => n.label).join('/'), cate_id: e.detail.value[e.detail.value.length-1] })
    
  },
  // 上传图片
  upload(e){
    var that = this;
    
    this.uploadpic(e, 1, 'spu_intro','', function (spu_intro){
      
      that.setData({
        spu_intro: spu_intro,
      });
      for (var j in spu_intro) {
        if (spu_intro[j]['upload_percent'] == 0) {
          //调用函数
          util.upload_pic(apiurl.upload_image, that, spu_intro, j,function(e){
            
            that.setData({
              spu_intro: e,
            });
            
            util.hideLoading()
          },function(e){
            that.setData({
              spu_intro: e,
            });
            
          })
        }
      }
    })
  },
  uploadpicthumb(e) {
    var that = this;
    
    var index = e.currentTarget.dataset.indexnum;
    
    this.uploadpic(e, 1, 'thumb', e.currentTarget.dataset.indexnum, function (thumb) {
      
      that.setData({
        ['thumb[' + index +']']: thumb,
      });
      for (var j in thumb) {
        if (thumb[j]['upload_percent'] == 0) {
          //调用函数
          util.upload_pic(apiurl.upload_image, that, thumb, j, function (e) {
            that.setData({
              ['thumb[' + index + ']']: e,
            });
            util.hideLoading()
          }, function (e) {
            that.setData({
              ['thumb[' + index + ']']: e,
            });
          })
        }
      }
    })
  },
  uploadpicimages(e) {
    var that = this;
    var index = e.currentTarget.dataset.indexnum;
    
    this.uploadpic(e, 9, 'images', e.currentTarget.dataset.indexnum, function (images) {

      that.setData({
        ['images[' + index + ']']: images,
      });
      for (var j in images) {
        if (images[j]['upload_percent'] == 0) {
          //调用函数
          util.upload_pic(apiurl.upload_image, that, images, j, function (e) {
            that.setData({
              ['images[' + index + ']']: e,
            });
            util.hideLoading()
          }, function (e) {
            that.setData({
              ['images[' + index + ']']: e,
            });
          })
        }
      }
    })
  },
  uploadpic: function (e, num, names, index = '',suc) {
    var that = this //获取上下文
    var name = that.data[names]
    if (index !== ''){
      name = name[index]
    }
    //选择图片
    
    wx.chooseImage({
      count: num,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFiles = res.tempFiles
        var promiseArr = []
        for (var i in tempFiles) {

          let promise = new Promise((resolve, reject) => {
            wx.getFileSystemManager().readFile({
              filePath: tempFiles[i]['path'], //选择图片返回的相对路径
              encoding: 'base64', //编码格式
              success: res => { //成功的回调 
                resolve(res)
              },
              fail: function (error) {
                reject(error);
              },
            })
          })
          promiseArr.push(promise)
        }
        Promise.all(promiseArr).then((res) => {
          //对返回的result数组进行处理
          util.loading()
          for (var i in res) {
            tempFiles[i]['path_base'] = 'data:image/png;base64,' + res[i].data
            tempFiles[i]['upload_percent'] = 0
            tempFiles[i]['path_server'] = ''
            name.push(tempFiles[i])
          }
          suc(name)
        })
      }
    })
  },
 

  // 删除图片
  deleteImg: function (e) {
    let arr = this.data[e.currentTarget.dataset.name];
    // console.log(e.currentTarget.dataset.name)
    let index = e.currentTarget.dataset.index;
    
    if (e.currentTarget.dataset.name =='spu_intro'){
      this.setData({
        spu_intro:[]
      })
    } else if (e.currentTarget.dataset.name =="thumb"){
      var thumb = this.data.thumb;
      console.log(e.currentTarget.dataset.indexnum)
      console.log(e)
      thumb[e.currentTarget.dataset.indexnum]=[]
      console.log(thumb)
      this.setData({
        thumb: thumb
      })
    } else if (e.currentTarget.dataset.name == "images"){
      console.log('222222222')
      var images = this.data.images
      images[e.currentTarget.dataset.indexnum].splice(index, 1);
      
      this.setData({
        images: images
      })
    }
  },

  formSubmit(e){
    console.log(e.detail.value)
    var data = e.detail.value,that = this;
    data.cate_id = this.data.cate_id;
    data.shop_id = that.data.shop_id;
    console.log(e.detail.value['price[0]'])
    console.log(this.data.spu_intro)
    data.spu_intro = this.data.spu_intro[0]["path_server"]
    for (var i = 0; i < that.data.skunum;i++){
      console.log(i)
      data['sku_arr[' + i+'][key]'] = that.data.key[i]
      data['sku_arr[' + i + '][price]'] = e.detail.value['price['+i+']']
      data['sku_arr[' + i + '][stock]'] = e.detail.value['stock[' + i + ']']
      data['sku_arr[' + i + '][thumb]'] = that.data.thumb[i][0]['path_server']
      for (var j in that.data.images[i]){
        data['sku_arr[' + i +'][images][' + j +']'] = that.data.images[i][j]['path_server']
      }
      if (that.data.spu_id !== ""){
        data["sku_arr[" + i + "][operate]"] = 'edit'
        for (var a in that.data.add) {
          if (that.data.add[a] == that.data.key[i]) {
            data["sku_arr[" + i + "][operate]"] = 'add'
            console.log(i);
            console.log()
          }
        }
        for (var b in that.data.del) {
          if (that.data.del[b] == that.data.key[i]) {
            data["sku_arr[" + i + "][operate]"] = 'del'
          }
        }
      }
    }
    for (var p in that.data.del){
      data["sku_arr[" + (that.data.skunum.length + p) + "][operate]"] = 'del'
      data['sku_arr[' + (that.data.skunum.length + p) + '][key]'] = that.data.key[p]
    }

    if (that.data.spu_id !==""){
      data.spu_id = that.data.spu_id;
      
    }
    that.setData({
      post: true
    })
    util.postJSON({ apiUrl: apiurl[that.data.url], data: data }, function (res) {
      var result = res.data.result
      util.alert(res.data.message)
      setTimeout(function(){
        wx.navigateBack({
          delta: 1,
        })
        that.setData({
          post: false
        })
      },2600)
      
    }, function (res) {
      
      that.setData({
        post: false
      })
    }, function (res) {

      that.setData({
        post: false
      })
    })
  }
})