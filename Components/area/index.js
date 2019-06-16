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
    title: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '所在地区' // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    classN: {
      type: String,
      value: '',
    },
    // 弹窗内容
    ban: {
      type: String,
      value: ''
    },
    areaSelectedStr: {
      type: String,
      value: ''
    },
    tokonw: {
      type: String,
      value: ''
    },
    placeholder: {
      type: String,
      value: ''
    }
  },

  data: {
    areaSelectedStr: '',
    area_id_val: 0,
    maskVisual: 'hidden',
    disabled: false,
    item: '',
    url: 'shippingAddress_store',
    cengji: [{
      currentname: '请选择',
      array: [],
      area: [],
      currentindex: -1
    }],
    currentindex: 0,
    current: 0,
    isbiotope: false,
    biotopecurrent: -1,
    biotope_name: '',
    dong: '',
    unit: ''
  },

  methods: {
    /*
     * 公有方法
     */

    onload() {
      this.loadAddress()
    },
    // 地区选择
    loadAddress: function(options) {
      var that = this;
      this.getArea(0, function(array, area) {
        var cengji = that.data.cengji
        cengji[0]['array'] = array
        cengji[0]['area'] = area
        that.setData({
          cengji: cengji
        });
      });
    },
    cascadePopup: function() {
      var animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-in-out',
      });
      this.animation = animation;
      animation.translateY(-285).step();
      this.setData({
        animationData: this.animation.export(),
        maskVisual: 'show'
      });
    },
    cascadeDismiss(numl=0) {
      var that = this
      this.animation.translateY(285).step();
      this.setData({
        animationData: this.animation.export(),
        maskVisual: 'hidden'
      });
      var areaSelectedStr = [], cengji = that.data.cengji
      for (var i in cengji) {
        if (cengji[i].currentname!="请选择")
        areaSelectedStr = areaSelectedStr + " " + cengji[i].currentname
      }
      if(numl!=1){
        this.setData({
          current: that.data.current-1
        })
      }
      return that.triggerEvent("choosea", {
        areaSelectedStr: areaSelectedStr,
        area_id_val: that.data.cengji[that.data.current]['area'][that.data.index] && that.data.cengji[that.data.current]['area'][that.data.index]["area_id"] ? that.data.cengji[that.data.current]['area'][that.data.index]["area_id"]:'',
        area: that.data.cengji[that.data.current]['area'][that.data.index]||'',
        isbiotope: that.data.isbiotope,
        konwname: that.data.konwname||'',
        biotope_name: that.data.biotope_name,
        dong: that.data.dong,
        unit: that.data.unit
      })
    },
    choosearea(e) {
      var that = this;
      var index = e.currentTarget.dataset.index;
      var cengji = this.data.cengji,konwname = '';
      cengji[this.data.current]['currentname'] = this.data.cengji[this.data.current]['array'][index]
      cengji[this.data.current]['currentindex'] = index
      this.setData({
        cengji: cengji,
        index: index
      });
      if (cengji[this.data.current]['area'][0]["type"] == that.data.ban) { //在哪一层停止
        var areaSelectedStr = ''
        for (var i in cengji) {
          areaSelectedStr = areaSelectedStr + " " + cengji[i].currentname
          if (cengji[i]['area'][0]["type"] == that.data.tokonw) { //知道与之对应的选择的昵称
            konwname = cengji[i].currentname
          }
        }
        this.setData({
          konwname: konwname,
          areaSelectedStr: areaSelectedStr
        })
        return that.cascadeDismiss(1);
      }
      if (cengji[this.data.current]['area'][0]["type"] == 'biotope') {
        this.setData({
          isbiotope: true,
          biotopecurrent: this.data.current,
          biotope_name: cengji[this.data.current]['array'][index]
        })
      }
      if (cengji[this.data.current]['area'][0]["type"] == 'dong') {
        this.setData({
          dong: cengji[this.data.current]['array'][index]
        })
      }
      if (cengji[this.data.current]['area'][0]["type"] == 'unit') {
        this.setData({
          unit: cengji[this.data.current]['array'][index]
        })
      }
      if (this.data.current < that.data.biotopecurrent) {
        this.setData({
          isbiotope: false,
          biotope_name: ''
        })
      }
      this.getArea(this.data.cengji[that.data.current]['area'][index]["area_id"], function(array, area) {
        if (area.length == 0) {
          var areaSelectedStr = ''
          for (var i in cengji) {
            if (i > that.data.current) {
              cengji.splice(i, 1)

            } else {
              areaSelectedStr = areaSelectedStr + " " + cengji[i].currentname
            }

          }
          that.setData({
            areaSelectedStr: areaSelectedStr,
            area_id_val: that.data.cengji[that.data.current]['area'][index]["area_id"]
          });
          return that.cascadeDismiss(1);
        }

        if (that.data.currentindex <= that.data.current) {
          cengji.push({
            currentname: '请选择',
            array: array,
            area: area,
            currentindex: -1
          })

        } else {

          for (var i in cengji) {
            if (i > that.data.current) {
              cengji.splice(i, 1)
            }
          }
          cengji[that.data.current + 1] = {
            currentname: '请选择',
            array: array,
            area: area,
            currentindex: -1
          }
        }
        that.setData({
          cengji: cengji,
          current: that.data.current + 1,
          currentindex: that.data.current + 1,
        });

      });
    },
    getArea: function(pid, cb) {
      var that = this;
      util.getJSON({
        apiUrl: apiurl.area + pid
      }, function(res) {
        var area = res.data.result.list,
          array = []
        for (var i = 0; i < area.length; i++) {
          array[i] = area[i]['name'];
        }
        cb(array, area)
      })
    },
    currentChanged: function(e) {
      // swiper滚动使得current值被动变化，用于高亮标记
      var current = e.detail.current;
      this.setData({
        current: current
      });

    },
    changeCurrent: function(e) {
      // 记录点击的标题所在的区级级别
      var current = e.currentTarget.dataset.current;
      this.setData({
        current: current,
        // currentindex: current,
      });
    },
  }
})