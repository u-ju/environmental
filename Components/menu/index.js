// components/Menu/menu.js
var systemInfo = wx.getSystemInfoSync();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: false,//是否已经弹出
    animMain: {},//旋转动画
    animAdd: {},//item位移,透明度
    animDelLots: {},//item位移,透明度
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //点击弹出或者收起
    showOrHide: function () {
      if (this.data.isShow) {
        //缩回动画
        this.takeback();
        this.setData({
          isShow: false
        })
      } else {
        //弹出动画
        this.popp();
        this.setData({
          isShow: true
        })
      }
    },
    
    add: function () {
      this.triggerEvent("addEvent")
      // this.showOrHide()
      if (wx.pageScrollTo) {
        console.log(1)
        wx.pageScrollTo({
          scrollTop: 0
        })
      } else {
        console.log(1)
        wx.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
        })
      }
      this.showOrHide()
    },
    deleteLots: function () {
      this.showOrHide()
      wx.navigateTo({
        url: '../find/find',
      })
    },

    //弹出动画
    popp: function () {
      //main按钮顺时针旋转
      var animationMain = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      var animationDelLots = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      var animationAdd = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      animationMain.rotateZ(225).step();
      animationDelLots.translate(0, -200 / 750 * systemInfo.windowWidth).rotateZ(360).opacity(1).step();
      animationAdd.translate(0, -320 / 750 * systemInfo.windowWidth).rotateZ(360).opacity(1).step();
      this.setData({
        animMain: animationMain.export(),
        animDelLots: animationDelLots.export(),
        animAdd: animationAdd.export(),
      })
    },
    //收回动画
    takeback: function () {
      //main按钮逆时针旋转
      var animationMain = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      var animationDelLots = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      var animationAdd = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      animationMain.rotateZ(0).step();
      animationDelLots.translate(0, 0).rotateZ(0).opacity(0).step();
      animationAdd.translate(0, 0).rotateZ(0).opacity(0).step();
      this.setData({
        animMain: animationMain.export(),
        animDelLots: animationDelLots.export(),
        animAdd: animationAdd.export(),
      })
    }
  },
  //解决滚动穿透问题
  myCatchTouch: function () {
    return
  }
})
