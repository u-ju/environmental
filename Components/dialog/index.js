// components/Dialog/dialog.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '标题' // 属性初始值（可选），如果未指定则会根据类型选择一个
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    // 弹窗显示控制
    isShow: false,
    type_input: "input",
    type_btn: "button",
    id_sex: "sex",
    id_group: "group",
    dataObject: [],
    sexDefault: "男",
    groupDefault: "组织",
    sexArray: ['男', '女'],
    groupArray: ['组织', '群众'],
    bean: {},
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /*
     * 公有方法
     */
    setDataObj(dataObj, beanObj) {
      this.setData({
        dataObject: dataObj,
        bean: beanObj
      })
      if (beanObj.hasOwnProperty("sex") && beanObj.sex != "") {
        this.setData({
          sexDefault: beanObj.sex
        })
      }
      if (beanObj.hasOwnProperty("group") && beanObj.group != "") {
        this.setData({
          groupDefault: beanObj.group
        })
      }
    },
    //隐藏弹框
    hideDialog() {
      this._showOrCloseDialog("close")
    },
    //展示弹框
    showDialog() {
      this._showOrCloseDialog("open")
    },
    /*
     * 内部私有方法建议以下划线开头
     * triggerEvent 用于触发事件
     */

    _formSubmit(e) {
      if ("" === e.detail.value.name) {
        wx.showToast({
          title: '请填写姓名',
          icon: 'none'
        })
        return
      }
      if ("" === e.detail.value.phone) {
        wx.showToast({
          title: '请填写电话',
          icon: 'none'
        })
        return
      }
      this._showOrCloseDialog("close")
      //触发成功回调
      this.triggerEvent("confirmEvent", {
        e: e
      });
    },

    sexButton: function () {
      var that = this;
      wx.showActionSheet({
        itemList: this.data.sexArray,
        success: function (res) {
          console.log(res.tapIndex)
          that.setData({
            sexDefault: that.data.sexArray[res.tapIndex]
          })
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      })
    },
    groupButton: function () {
      var that = this;
      wx.showActionSheet({
        itemList: this.data.groupArray,
        success: function (res) {
          console.log(res.tapIndex)
          that.setData({
            groupDefault: that.data.groupArray[res.tapIndex]
          })
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      })
    },
    _showOrCloseDialog: function (currentStatu) {
      var that = this;
      /* 动画部分 */
      // 第1步：创建动画实例 
      var animation = wx.createAnimation({
        duration: 200, //动画时长
        timingFunction: "linear", //线性
        delay: 0 //0则不延迟
      });

      // 第2步：这个动画实例赋给当前的动画实例
      this.animation = animation;

      // 第3步：执行第一组动画
      animation.opacity(0).rotateX(-100).step();

      // 第4步：导出动画对象赋给数据对象储存
      that.setData({
        animationData: animation.export()
      })

      // 第5步：设置定时器到指定时候后，执行第二组动画
      setTimeout(function () {
        // 执行第二组动画
        animation.opacity(1).rotateX(0).step();
        // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
        that.setData({
          animationData: animation
        })

        //关闭
        if (currentStatu == "close") {
          that.setData({
            isShow: false
          });
        }
      }.bind(this), 200)

      // 显示
      if (currentStatu == "open") {
        that.setData({
          isShow: true
        });
      }
    }
  },
  //解决滚动穿透问题
  myCatchTouch: function () {
    return
  }
})
